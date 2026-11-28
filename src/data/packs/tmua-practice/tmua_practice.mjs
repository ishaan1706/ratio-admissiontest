// Pure helpers; the caller owns rendering, storage and clocks.
const emptyHistory = () => ({ version: 1, first: {}, latest: {}, queue: {} });
const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

export function localDay(now = new Date()) {
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0')).join('-');
}

export function practiceSeconds(count) {
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new RangeError('Use 1–20 questions');
  return count * 225;
}

const records = (data) => data && typeof data === 'object' && !Array.isArray(data);
const dateTime = (v) => typeof v === 'string' && Number.isFinite(Date.parse(v));
const outcome = (v) => records(v) && ['correct', 'wrong', 'unanswered'].includes(v.status)
  && typeof v.guessed === 'boolean' && typeof v.assisted === 'boolean' && dateTime(v.at);

export function readHistory(raw) {
  let data;
  try { data = JSON.parse(raw); } catch { return emptyHistory(); }
  if (!records(data) || data.version !== 1) return emptyHistory();
  const safe = emptyHistory();
  for (const key of ['first', 'latest', 'queue']) {
    if (!records(data[key])) continue;
    safe[key] = Object.fromEntries(Object.entries(data[key]).filter(([, value]) =>
      outcome(value) && (key !== 'queue' || value.status !== 'correct' || value.guessed || value.assisted)
    ));
  }
  return safe;
}

// Commit one result per item at submission; null/undefined means unanswered.
export function recordResult(history, question, {
  selected, guessed = false, assisted = false, at, reason = null, note = '',
}) {
  if (selected != null && (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length)) {
    throw new RangeError('Invalid option index');
  }
  if (!dateTime(at)) throw new TypeError('Supply an ISO timestamp');
  const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'wrong';
  const result = { status, selected: selected ?? null, guessed: status !== 'unanswered' && Boolean(guessed),
    assisted: Boolean(assisted), at, reason, note: typeof note === 'string' ? note.slice(0, 500) : '' };
  const first = { ...history.first, [question.id]: history.first[question.id] ?? result };
  const latest = { ...history.latest, [question.id]: result };
  const queue = { ...history.queue };
  if (status === 'correct' && !result.guessed && !result.assisted) delete queue[question.id];
  else queue[question.id] = result;
  return { version: 1, first, latest, queue };
}

export function listReview(questions, history) {
  return questions.filter((q) => history.queue[q.id]).sort((a, b) =>
    Date.parse(history.queue[a.id].at) - Date.parse(history.queue[b.id].at) || a.id.localeCompare(b.id));
}

export function firstAttemptStats(questions, history) {
  const counts = {};
  for (const q of questions) {
    const result = history.first[q.id];
    if (!result) continue;
    const stat = counts[q.type] ??= { correct: 0, secure: 0, total: 0 };
    stat.total++;
    if (result.status === 'correct') {
      stat.correct++;
      if (!result.guessed && !result.assisted) stat.secure++;
    }
  }
  return counts;
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function bankQuestions(pack) {
  return pack.modules.flatMap((m) => m.questions);
}

export function selectQuestions(pack, history, {
  count = 5, paper, skill, difficulty, seed = 'tmua', adaptive = false,
} = {}) {
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new RangeError('Use 1–20 questions');
  const questions = bankQuestions(pack);
  const stats = firstAttemptStats(questions, history);
  const rank = (q) => {
    // One notional success plus one miss avoids overreacting to a single result.
    const s = stats[q.type];
    return adaptive && s ? (s.secure + 1) / (s.total + 2) : 0.5;
  };
  const pool = questions.filter((q) => (!paper || q.tags.includes(`paper-${paper}`))
    && (!skill || q.type === skill) && (difficulty == null || q.difficulty === difficulty));
  pool.sort((a, b) => Number(Boolean(history.first[a.id])) - Number(Boolean(history.first[b.id]))
    || rank(a) - rank(b) || hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id));
  const selected = [];
  const families = new Set();
  const skills = new Set();
  const take = (i) => {
    const q = pool.splice(i, 1)[0];
    families.add(q.family);
    skills.add(q.type);
    selected.push(q);
  };
  if (count >= 2 && !paper && !skill) {
    for (const p of [1, 2]) {
      const i = pool.findIndex((q) => q.tags.includes(`paper-${p}`));
      if (i !== -1) take(i);
    }
  }
  while (selected.length < count && pool.length) {
    const preferFresh = !history.first[pool[0].id];
    const diverse = (q) => (!preferFresh || !history.first[q.id]) && !families.has(q.family);
    let i = pool.findIndex((q) => diverse(q) && !skills.has(q.type));
    if (i < 0) i = pool.findIndex(diverse);
    take(i < 0 ? 0 : i);
  }
  return selected;
}

export function dailyFive(pack, history, day, saved) {
  if (!dayPattern.test(day)) throw new TypeError('Supply a local YYYY-MM-DD date');
  const bank = new Map(bankQuestions(pack).map((q) => [q.id, q]));
  const count = Math.min(pack.dailyQuestionCount, bank.size);
  if (saved?.day === day && Array.isArray(saved.ids) && saved.ids.length === count
      && new Set(saved.ids).size === count && saved.ids.every((id) => bank.has(id))) {
    return { day, ids: saved.ids.slice(), complete: saved.complete === true };
  }
  return { day, complete: false,
    ids: selectQuestions(pack, history, { count, seed: day, adaptive: true }).map((q) => q.id) };
}

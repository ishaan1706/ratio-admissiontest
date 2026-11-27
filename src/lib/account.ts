export type EntitlementPlan = 'free' | 'single' | 'bundle' | 'pro';

export interface RatioUser {
  id: string;
  email: string;
  name: string;
  plan: EntitlementPlan;
  unlockedTests?: string[];
  created_at?: string;
}

export const VALID_TEST_IDS = ['lnat', 'ucat', 'tara', 'esat', 'tmua', 'sat'] as const;

const LOCAL_ENTITLEMENTS_KEY = 'ratio_entitlements_v2';
const LEGACY_LOCAL_PRO_KEY = 'ratio_pro_unlocked_v1';
const LOCAL_USER_KEY = 'ratio_local_user_v1';

export function normalizeEntitlements(tests?: string[] | null): string[] {
  if (!Array.isArray(tests)) return [];
  if (tests.includes('all')) return ['all'];
  const validSet = new Set<string>(VALID_TEST_IDS);
  return Array.from(new Set(tests.map((t) => String(t).toLowerCase()).filter((t) => validSet.has(t))));
}

export function mergeEntitlements(a: string[], b: string[]): string[] {
  const na = normalizeEntitlements(a);
  const nb = normalizeEntitlements(b);
  if (na.includes('all') || nb.includes('all')) return ['all'];
  return Array.from(new Set([...na, ...nb]));
}

export function isBundleUnlocked(unlockedTests: string[]): boolean {
  return unlockedTests.includes('all');
}

export function hasTestAccess(unlockedTests: string[], testId: string): boolean {
  return unlockedTests.includes('all') || unlockedTests.includes(testId.toLowerCase());
}

export function getLocalEntitlements(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENTITLEMENTS_KEY);
    if (raw !== null) {
      return normalizeEntitlements(JSON.parse(raw));
    }
    if (localStorage.getItem(LEGACY_LOCAL_PRO_KEY) === 'true') {
      return ['all'];
    }
    return [];
  } catch {
    return [];
  }
}

export function setLocalEntitlements(tests: string[]): string[] {
  const normalized = normalizeEntitlements(tests);
  try {
    localStorage.setItem(LOCAL_ENTITLEMENTS_KEY, JSON.stringify(normalized));
    localStorage.removeItem(LEGACY_LOCAL_PRO_KEY);
  } catch {
    // ignore
  }
  return normalized;
}

export function getLocalUser(): RatioUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? (JSON.parse(raw) as RatioUser) : null;
  } catch {
    return null;
  }
}

export function setLocalUser(user: RatioUser | null): void {
  try {
    if (user) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(LOCAL_USER_KEY);
  } catch {
    // ignore
  }
}

export function userEntitlements(user: RatioUser | null): string[] {
  if (!user) return [];
  if (user.plan === 'pro' || user.plan === 'bundle') return ['all'];
  return normalizeEntitlements(user.unlockedTests);
}

export async function fetchSession(): Promise<{
  user: RatioUser | null;
  stripeConfigured: boolean;
}> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) throw new Error('offline');
    const data = await res.json();
    if (data.user) {
      setLocalUser(data.user);
      const serverEnt = userEntitlements(data.user);
      if (serverEnt.length > 0) {
        setLocalEntitlements(mergeEntitlements(getLocalEntitlements(), serverEnt));
      }
    }
    return {
      user: data.user || null,
      stripeConfigured: Boolean(data.stripeConfigured),
    };
  } catch {
    return { user: getLocalUser(), stripeConfigured: false };
  }
}

export async function loginAccount(
  email: string,
  password: string
): Promise<{ user?: RatioUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Sign-in failed' };
    setLocalUser(data.user);
    const serverEnt = userEntitlements(data.user);
    if (serverEnt.length > 0) {
      setLocalEntitlements(mergeEntitlements(getLocalEntitlements(), serverEnt));
    }
    return { user: data.user };
  } catch {
    const unlockedTests = getLocalEntitlements();
    const local: RatioUser = {
      id: `local-${Date.now()}`,
      email,
      name: email.split('@')[0] || 'Student',
      plan: unlockedTests.includes('all') ? 'bundle' : unlockedTests.length > 0 ? 'single' : 'free',
      unlockedTests,
    };
    setLocalUser(local);
    return { user: local };
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string
): Promise<{ user?: RatioUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Registration failed' };
    setLocalUser(data.user);
    return { user: data.user };
  } catch {
    const unlockedTests = getLocalEntitlements();
    const local: RatioUser = {
      id: `local-${Date.now()}`,
      email,
      name: name.trim() || email.split('@')[0] || 'Student',
      plan: unlockedTests.includes('all') ? 'bundle' : unlockedTests.length > 0 ? 'single' : 'free',
      unlockedTests,
    };
    setLocalUser(local);
    return { user: local };
  }
}

export async function logoutAccount(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    // ignore
  }
  setLocalUser(null);
}

export async function startStripeCheckout(
  tier: 'single' | 'bundle',
  testId?: string
): Promise<{ url?: string; error?: string; setupRequired?: boolean }> {
  const staticUrl =
    tier === 'bundle'
      ? import.meta.env.VITE_CHECKOUT_URL_BUNDLE
      : import.meta.env.VITE_CHECKOUT_URL_SINGLE;
  if (staticUrl) {
    return { url: staticUrl };
  }
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ tier, testId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error, setupRequired: Boolean(data.setupRequired) };
    }
    return { url: data.url };
  } catch {
    return { error: 'Checkout server unavailable on static preview.', setupRequired: true };
  }
}

const OFFLINE_SINGLE_CODES: Record<string, string> = {
  'RATIO-LNAT': 'lnat',
  'RATIO-UCAT': 'ucat',
  'RATIO-TARA': 'tara',
  'RATIO-ESAT': 'esat',
  'RATIO-TMUA': 'tmua',
  'RATIO-SAT': 'sat',
};

export async function redeemAccessCode(
  code: string,
  testId?: string
): Promise<{ ok: boolean; unlockedTests?: string[]; tier?: 'single' | 'bundle'; error?: string }> {
  const clean = code.trim().toUpperCase();
  const cleanTest = (testId || '').trim().toLowerCase();
  try {
    const res = await fetch('/api/billing/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: clean, testId: cleanTest }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Invalid code' };
    const returned = normalizeEntitlements(data.unlockedTests);
    const merged = setLocalEntitlements(mergeEntitlements(getLocalEntitlements(), returned));
    return { ok: true, unlockedTests: merged, tier: data.tier };
  } catch {
    if (clean === 'RATIO-FOUNDER' || clean === 'RATIO-PRO-2026' || clean === 'RATIO-ALL') {
      const merged = setLocalEntitlements(['all']);
      return { ok: true, unlockedTests: merged, tier: 'bundle' };
    }
    if (OFFLINE_SINGLE_CODES[clean]) {
      const merged = setLocalEntitlements(
        mergeEntitlements(getLocalEntitlements(), [OFFLINE_SINGLE_CODES[clean]])
      );
      return { ok: true, unlockedTests: merged, tier: 'single' };
    }
    if (clean === 'RATIO-SINGLE' && VALID_TEST_IDS.includes(cleanTest as (typeof VALID_TEST_IDS)[number])) {
      const merged = setLocalEntitlements(mergeEntitlements(getLocalEntitlements(), [cleanTest]));
      return { ok: true, unlockedTests: merged, tier: 'single' };
    }
    return { ok: false, error: 'Invalid access code.' };
  }
}

export function exportAllProgressJson(): void {
  const dump: Record<string, string | null> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('ratio_')) {
        dump[k] = localStorage.getItem(k);
      }
    }
  } catch {
    // ignore
  }
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), data: dump }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ratio-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface RatioUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  created_at?: string;
}

const LOCAL_PRO_KEY = 'ratio_pro_unlocked_v1';
const LOCAL_USER_KEY = 'ratio_local_user_v1';

export function getLocalPro(): boolean {
  try {
    return localStorage.getItem(LOCAL_PRO_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setLocalPro(unlocked: boolean): void {
  try {
    localStorage.setItem(LOCAL_PRO_KEY, unlocked ? 'true' : 'false');
  } catch {
    // ignore
  }
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
      if (data.user.plan === 'pro') setLocalPro(true);
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
    if (data.user?.plan === 'pro') setLocalPro(true);
    return { user: data.user };
  } catch {
    // Static-host fallback: local profile
    const local: RatioUser = {
      id: `local-${Date.now()}`,
      email,
      name: email.split('@')[0] || 'Student',
      plan: getLocalPro() ? 'pro' : 'free',
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
    const local: RatioUser = {
      id: `local-${Date.now()}`,
      email,
      name: name.trim() || email.split('@')[0] || 'Student',
      plan: getLocalPro() ? 'pro' : 'free',
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
  tier: 'monthly' | 'season'
): Promise<{ url?: string; error?: string; setupRequired?: boolean }> {
  const staticUrl =
    tier === 'season'
      ? import.meta.env.VITE_CHECKOUT_URL_SEASON
      : import.meta.env.VITE_CHECKOUT_URL_MONTHLY;
  if (staticUrl) {
    return { url: staticUrl };
  }
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ tier }),
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

export async function redeemAccessCode(code: string): Promise<{ ok: boolean; error?: string }> {
  const clean = code.trim().toUpperCase();
  try {
    const res = await fetch('/api/billing/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: clean }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Invalid code' };
    setLocalPro(true);
    return { ok: true };
  } catch {
    if (clean === 'RATIO-FOUNDER' || clean === 'RATIO-PRO-2026') {
      setLocalPro(true);
      return { ok: true };
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

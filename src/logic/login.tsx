import type {
  BskyAgent,
  AtpSessionData,
  AtpSessionEvent,
} from '@atproto/api';
import {
  clearBskySessionOnLocalStorage,
  getBskySessionOnLocalStorage,
  saveBskySessionOnLocalStorage,
} from '@/logic/localstorage';

const BSKY_SERVICE = 'https://bsky.social';

type RestoreSessionResult = {
  restored: boolean;
  hadSavedSession: boolean;
  user: string;
  error: string;
};

const getSessionUser = (session?: Partial<AtpSessionData> | null) => {
  return session?.handle || session?.did || '';
};

export type BskyProfile = {
  displayName: string;
  handle: string;
  avatar?: string;
};

// Resilient profile lookup: returns null on any failure so the UI never blocks.
export const fetchProfile = async (
  agent: BskyAgent,
  actor: string
): Promise<BskyProfile | null> => {
  if (!actor) {
    return null;
  }

  try {
    const { data } = await agent.getProfile({ actor });
    return {
      displayName: data.displayName || data.handle,
      handle: data.handle,
      avatar: data.avatar,
    };
  } catch {
    return null;
  }
};

// Loads @atproto/api lazily so the SDK is split into an async chunk
// instead of bloating the initial bundle.
export const createBskyAgent = async (): Promise<BskyAgent> => {
  const { BskyAgent } = await import('@atproto/api');
  return new BskyAgent({
    service: BSKY_SERVICE,
    persistSession: (event: AtpSessionEvent, session?: AtpSessionData) => {
      if (session && (event === 'create' || event === 'update')) {
        saveBskySessionOnLocalStorage(session);
      }

      if (event === 'expired' || event === 'create-failed') {
        clearBskySessionOnLocalStorage();
      }
    },
  });
};

export const restoreSavedSession = async (
  agent: BskyAgent
): Promise<RestoreSessionResult> => {
  const savedSession = getBskySessionOnLocalStorage() as AtpSessionData | null;

  if (!savedSession) {
    return { restored: false, hadSavedSession: false, user: '', error: '' };
  }

  try {
    await agent.resumeSession(savedSession);
    return {
      restored: true,
      hadSavedSession: true,
      user: getSessionUser(agent.session || savedSession),
      error: '',
    };
  } catch {
    clearBskySessionOnLocalStorage();
    return {
      restored: false,
      hadSavedSession: true,
      user: '',
      error: 'Saved login expired. Please sign in again.',
    };
  }
};

export const loginWithCredentials = async (
  agent: BskyAgent,
  user: string,
  password: string
) => {
  const response = await agent.login({
    identifier: user,
    password,
  });
  const session = response?.data || agent.session;

  if (session) {
    saveBskySessionOnLocalStorage(session);
  }

  return session;
};

export const clearSavedSession = () => {
  clearBskySessionOnLocalStorage();
};

export const getLoginErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error || '');

  if (message.includes('401') || message.toLowerCase().includes('auth')) {
    return 'Could not sign in. Check your handle and app password.';
  }

  return 'Could not sign in. Please try again.';
};

const POSTS_STORAGE_KEY = 'busqued.v0.1';
const BSKY_SESSION_STORAGE_KEY = 'busqued.bsky.session.v1';

const readFromLocalStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

export const savePostOnLocalStorage = (postToSave: unknown) => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(postToSave));
};

export const getPostOnLocalStorage = () => {
  return readFromLocalStorage(POSTS_STORAGE_KEY, {});
};

export const saveBskySessionOnLocalStorage = (session: unknown) => {
  localStorage.setItem(BSKY_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const getBskySessionOnLocalStorage = () => {
  return readFromLocalStorage(BSKY_SESSION_STORAGE_KEY, null);
};

export const clearBskySessionOnLocalStorage = () => {
  localStorage.removeItem(BSKY_SESSION_STORAGE_KEY);
};

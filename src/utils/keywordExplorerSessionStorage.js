export const KEYWORD_EXPLORER_SESSION_STORAGE_KEY = 'creator_os_keyword_explorer_session_v1';
export const KEYWORD_EXPLORER_SESSION_MAX_AGE_MS = 6 * 60 * 60 * 1000;

const getBrowserSessionStorage = () => {
  try {
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
};

const getStorage = (storage) => (storage === undefined ? getBrowserSessionStorage() : storage);

export function readKeywordExplorerSession({ storage, now = Date.now() } = {}) {
  const target = getStorage(storage);
  if (!target) return {};
  try {
    const rawValue = target.getItem(KEYWORD_EXPLORER_SESSION_STORAGE_KEY);
    if (!rawValue) return {};
    const payload = JSON.parse(rawValue);
    const savedAt = Number(payload?.savedAt || 0);
    const session = payload?.session;
    if (!session || typeof session !== 'object' || Array.isArray(session) || !savedAt || now - savedAt > KEYWORD_EXPLORER_SESSION_MAX_AGE_MS) {
      target.removeItem(KEYWORD_EXPLORER_SESSION_STORAGE_KEY);
      return {};
    }
    return { ...session, _restoredAt: savedAt, _restoredFromSession: true };
  } catch {
    return {};
  }
}

export function writeKeywordExplorerSession(session, { storage, now = Date.now() } = {}) {
  const target = getStorage(storage);
  if (!target || !session || typeof session !== 'object' || Array.isArray(session)) return false;
  try {
    const { _restoredAt, _restoredFromSession, ...storedSession } = session;
    target.setItem(KEYWORD_EXPLORER_SESSION_STORAGE_KEY, JSON.stringify({
      savedAt: now,
      session: storedSession,
      version: 1,
    }));
    return true;
  } catch {
    return false;
  }
}

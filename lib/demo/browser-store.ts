import type {
  ChallengeCollectionItem,
  ChallengeReview,
  ChallengeSession,
  ChallengeDemoState,
  StarterDemoContent,
} from '@/lib/types/challenge';
import {
  createEmptyChallengeState,
  normalizeChallengeState,
  provisionChallengeState,
  saveCollectionItemToState,
  saveReviewToState,
  saveSessionToState,
} from '@/lib/demo/challenge-state';

export interface BrowserDemoState extends ChallengeDemoState {}

const EMPTY_STATE: BrowserDemoState = createEmptyChallengeState();

export interface DemoStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  keys?(): string[];
}

export type StorageLike = DemoStorageAdapter;

function storageKey(userId: string): string {
  return `joe-speaking-demo:${userId}`;
}

function readState(storage: DemoStorageAdapter, key: string): BrowserDemoState {
  const raw = storage.getItem(key);
  if (!raw) {
    return EMPTY_STATE;
  }

  try {
    return normalizeChallengeState(JSON.parse(raw));
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(storage: DemoStorageAdapter, key: string, state: BrowserDemoState): BrowserDemoState {
  storage.setItem(key, JSON.stringify(state));
  return state;
}

export function createMemoryStorage(): DemoStorageAdapter {
  const store = new Map<string, string>();
  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    keys() {
      return Array.from(store.keys());
    },
  };
}

function resolveStateKey(storage: DemoStorageAdapter, userId?: string): string | null {
  if (userId) {
    return storageKey(userId);
  }

  const availableKeys = storage.keys?.() ?? [];
  return availableKeys.find((key) => key.startsWith('joe-speaking-demo:')) ?? null;
}

export function loadDemoState(storage: DemoStorageAdapter, userId?: string): BrowserDemoState {
  const key = resolveStateKey(storage, userId);
  if (!key) {
    return EMPTY_STATE;
  }
  return readState(storage, key);
}

export function seedStarterContent(
  storage: DemoStorageAdapter,
  starter: StarterDemoContent,
): BrowserDemoState {
  const key = storageKey(starter.sampleSession.userId);
  return writeState(storage, key, provisionChallengeState(readState(storage, key), starter));
}

export function addSessionAttempt(
  storage: DemoStorageAdapter,
  session: ChallengeSession,
): BrowserDemoState {
  const key = storageKey(session.userId);
  return writeState(storage, key, saveSessionToState(readState(storage, key), session));
}

export function saveDemoState(
  storage: DemoStorageAdapter,
  state: BrowserDemoState,
  userId?: string,
): BrowserDemoState {
  const key = resolveStateKey(storage, userId) ?? storageKey(userId ?? 'local-demo-user');
  return writeState(storage, key, state);
}

function getBrowserStorage(): DemoStorageAdapter | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    getItem(key: string) {
      return window.localStorage.getItem(key);
    },
    setItem(key: string, value: string) {
      window.localStorage.setItem(key, value);
    },
    removeItem(key: string) {
      window.localStorage.removeItem(key);
    },
    keys() {
      return Object.keys(window.localStorage);
    },
  };
}

export function createBrowserDemoStore(userId: string) {
  const key = storageKey(userId);
  const storage = getBrowserStorage();

  function read(): BrowserDemoState {
    if (!storage) {
      return EMPTY_STATE;
    }

    const raw = storage.getItem(key);
    if (!raw) {
      return EMPTY_STATE;
    }

    try {
      return normalizeChallengeState(JSON.parse(raw));
    } catch {
      return EMPTY_STATE;
    }
  }

  function write(state: BrowserDemoState): BrowserDemoState {
    if (storage) {
      storage.setItem(key, JSON.stringify(state));
    }
    return state;
  }

  function provision(starter: StarterDemoContent): BrowserDemoState {
    return write(provisionChallengeState(read(), starter));
  }

  function saveSession(session: ChallengeSession): BrowserDemoState {
    return write(saveSessionToState(read(), session));
  }

  function saveReview(review: ChallengeReview): BrowserDemoState {
    return write(saveReviewToState(read(), review));
  }

  function saveCollectionItem(item: ChallengeCollectionItem): BrowserDemoState {
    return write(saveCollectionItemToState(read(), item));
  }

  function replace(state: BrowserDemoState): BrowserDemoState {
    return write(state);
  }

  function clear(): void {
    if (storage) {
      storage.removeItem(key);
    }
  }

  return {
    read,
    provision,
    saveSession,
    saveReview,
    saveCollectionItem,
    replace,
    clear,
  };
}

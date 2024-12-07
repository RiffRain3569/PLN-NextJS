import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
    key: 'lotto',
    storage: sessionStorage,
});

export const picksState = atom({
    key: `picksState`,
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const posPicksState = atom({
    key: `posPicksState`,
    default: [[], [], [], [], [], []],
    effects_UNSTABLE: [persistAtom],
});

export const savePickState = atom<(number[] | null)[]>({
    key: `savePickState`,
    default: [],
    effects_UNSTABLE: [persistAtom],
});

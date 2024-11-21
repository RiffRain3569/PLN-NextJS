import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'lotto',
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

export const savePickState = atom<number[][]>({
    key: `savePickState`,
    default: [[1, 2, 3, 4, 5, 6]],
    effects_UNSTABLE: [persistAtom],
});

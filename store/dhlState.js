import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'dhlState',
});

export const jsessionIdState = atom({
    key: 'jsessionId',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const uidState = atom({
    key: 'uid',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

import { atom } from 'recoil';
import { v1 } from 'uuid';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'dhlState',
});

export const jsessionIdState = atom({
    key: `jsessionId/${v1}`,
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const uidState = atom({
    key: `uid/${v1}`,
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const amountState = atom({
    key: `amount/${v1}`,
    default: '',
    effects_UNSTABLE: [persistAtom],
});

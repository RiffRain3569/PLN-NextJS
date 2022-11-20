import React from 'react';
import { useRecoilState } from 'recoil';
import { jsessionIdState, uidState } from '../store/dhlState';

const useDhl = () => {
    const [jsessionId, setJsessionId] = useRecoilState(jsessionIdState);
    const [uid, setUid] = useRecoilState(uidState);

    return { jsessionId, uid, setJsessionId, setUid };
};

export default useDhl;

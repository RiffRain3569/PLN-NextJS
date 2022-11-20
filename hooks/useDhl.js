import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { jsessionIdState, uidState } from '../store/dhlState';

const useDhl = () => {
    const [jsessionId, setJsessionId] = useRecoilState(jsessionIdState);
    const [uid, setUid] = useRecoilState(uidState);
    const [curUid, setUidState] = useState('');

    useEffect(() => {
        setUidState(uid);
    }, []);

    return { jsessionId, uid: curUid, setJsessionId, setUid };
};

export default useDhl;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { amountState, jsessionIdState, uidState } from '../store/dhlState';

const useDhl = () => {
    const [jsessionId, setJsessionId] = useRecoilState(jsessionIdState);
    const [uid, setUid] = useRecoilState(uidState);
    const [amount, setAmount] = useRecoilState(amountState);
    const [curUid, setUidState] = useState('');
    const [curAmount, setAmountState] = useState('');

    const [reset, setReset] = useState(false);

    useEffect(() => {
        setUidState(uid);
        setAmountState(amount);
    }, [uid]);

    useEffect(() => {
        if (reset) {
            axios({
                method: 'POST',
                url: '/api/dhl/jsessionid',
                headers: { 'Content-type': 'application/json' },
                data: { jsessionId },
            }).then((response) => {
                setJsessionId(response.data.jsessionId);
                setUid(response.data.uid);
                setAmount(response.data.amount);
            });
            setReset(false);
        }
    }, [reset]);

    return { jsessionId, uid: curUid, amount: curAmount, setReset };
};

export default useDhl;

import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { dhlJsessionid } from '../apis/dhl/ssr';
import { amountState, jsessionIdState, uidState } from '../store/dhlState';

const useDhl = () => {
    const [jsessionId, setJsessionId] = useRecoilState(jsessionIdState);
    const [uid, setUid] = useRecoilState(uidState);
    const [amount, setAmount] = useRecoilState(amountState);
    const [curUid, setUidState] = useState('');
    const [curAmount, setAmountState] = useState('');

    const [reset, setReset] = useState(false);

    const dhlSessionMutation = useMutation(dhlJsessionid, {
        onSuccess: (res) => {
            setJsessionId(res.jsessionId);
            setUid(res.uid);
            setAmount(res.amount);
            setReset(false);
        },
    });

    useEffect(() => {
        setUidState(uid);
        setAmountState(amount);
    }, [uid]);

    useEffect(() => {
        if (reset) {
            dhlSessionMutation.mutate({ jsessionId });
        }
    }, [reset]);

    return { jsessionId, uid: curUid, amount: curAmount, setReset };
};

export default useDhl;

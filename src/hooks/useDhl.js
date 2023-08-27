import { dhlJsessionid } from '@apis/dhl/ssr';
import { amountState, jsessionIdState, uidState } from '@store/dhlState';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

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

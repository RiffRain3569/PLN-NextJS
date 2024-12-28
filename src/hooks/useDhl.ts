import { dhlJsessionid } from '@apis/client/dhl';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

const useDhl = () => {
    const [curUid, setUidState] = useState('');
    const [curAmount, setAmountState] = useState('');

    const [reset, setReset] = useState(false);

    const queryData = useQuery({
        queryKey: ['session', `${new Date().getTime()}`],
        queryFn: async () => {
            const res = await dhlJsessionid();

            setUidState(res.uid);
            setAmountState(res.amount);
        },
        enabled: !!getCookie('UID'),
    });

    useEffect(() => {
        if (reset || !!getCookie('UID')) {
            setReset(false);
            queryData.refetch();
        }
    }, [reset, !!getCookie('UID')]);

    return { uid: curUid, amount: curAmount, setReset };
};

export default useDhl;

import { dhlJsessionid } from '@apis/client/dhl';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

const useDhl = () => {
    const [curUserId, setUidState] = useState('');
    const [curAmount, setAmountState] = useState('');
    const [reset, setReset] = useState(false);

    const queryData = useQuery({
        queryKey: ['dhl-session'],
        queryFn: async () => {
            const res = await dhlJsessionid();
            setUidState(res.userId);
            setAmountState(res.amount);
            return res;
        },
        enabled: !!getCookie('dhl_userId'),
        staleTime: 1000 * 60 * 5, // 5분 캐시
    });

    useEffect(() => {
        if (reset || !!getCookie('dhl_userId')) {
            setReset(false);
            queryData.refetch();
        }
    }, [reset]);

    return { userId: curUserId, amount: curAmount, setReset };
};

export default useDhl;

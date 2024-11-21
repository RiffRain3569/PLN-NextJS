import { dhlJsessionid } from '@apis/dhl/ssr';
import { useQuery } from '@tanstack/react-query';
import { getCookie, getCookies } from 'cookies-next';
import { useEffect, useState } from 'react';

const useDhl = () => {
    const [curUid, setUidState] = useState('');
    const [curAmount, setAmountState] = useState('');

    const [reset, setReset] = useState(false);

    const queryData = useQuery({
        queryKey: [''],
        queryFn: dhlJsessionid,
        onSuccess: (res) => {
            setUidState(res.uid);
            setAmountState(res.amount);
            setReset(false);
        },
        enabled: !!getCookie('UID'),
    });

    useEffect(() => {
        console.log(getCookies());
        if (reset || !!getCookie('UID')) {
            queryData.refetch();
        }
    }, [reset, !!getCookie('UID')]);

    return { uid: curUid, amount: curAmount, setReset };
};

export default useDhl;

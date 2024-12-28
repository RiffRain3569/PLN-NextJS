import LttPickPanel from '@components/client/home/LttPickPanel';
import View from '@components/_layout/client/View';
import { Spinner, V } from '@components/_ui/index';
import { useEffect, useState } from 'react';
import LttPosPickPanel from '../components/client/home/LttPosPickPanel';

const Page = () => {
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    if (!isLoad)
        return (
            <View>
                <Spinner />
            </View>
        );
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <LttPickPanel />
                <LttPosPickPanel />
            </V.Row>
        </View>
    );
};

export default Page;

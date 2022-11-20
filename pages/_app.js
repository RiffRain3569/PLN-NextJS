import '../styles/globals.css';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { jsessionIdState } from '../store/dhlState';
import { useEffect } from 'react';
import axios from 'axios';

const Item = ({ Component, pageProps }) => {
    const setJsessionId = useSetRecoilState(jsessionIdState);
    useEffect(() => {
        axios.get('/api/dhl/jsessionid').then((response) => setJsessionId(response.data));
    }, []);

    return <Component {...pageProps} />;
};

const MyApp = (props) => {
    return (
        <RecoilRoot>
            <Item {...props} />
        </RecoilRoot>
    );
};

export default MyApp;

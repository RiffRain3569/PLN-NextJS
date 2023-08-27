import { GET, POST } from '@constants/httpMethod';
import axios from 'axios';

export const dhlSsrApi = async ({ url, method, reqData }) => {
    return await axios({
        method: method,
        url: `/api/dhl${url}`,
        headers: { 'Content-type': 'application/json' },
        data: method === POST ? { ...reqData } : {},
        param: method === GET ? { ...reqData } : {},
        withCredentials: true,
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
};

export const dhlSignIn = async ({ userId = '', userPw = '' }) => {
    return await dhlSsrApi({
        url: `/sign-in`,
        method: POST,
        reqData: { userId, userPw },
    });
};

export const dhlJsessionid = async () => {
    return await dhlSsrApi({
        url: `/jsessionid`,
        method: POST,
    });
};

export const dhlBuyLotto = async ({ dataList }) => {
    return await dhlSsrApi({
        url: `/buy-lotto`,
        method: POST,
        reqData: { dataList },
    });
};

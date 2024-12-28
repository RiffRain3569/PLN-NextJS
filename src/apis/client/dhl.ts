import { GET, POST } from '@constants/httpMethod';
import axios, { AxiosRequestConfig } from 'axios';

export const dhlSsrApi = async ({ url, method, reqData }: any) => {
    return await axios({
        method: method,
        url: `/api/dhl${url}`,
        headers: { 'Content-type': 'application/json' },
        data: method === POST ? { ...reqData } : {},
        param: method === GET ? { ...reqData } : {},
        withCredentials: true,
    } as AxiosRequestConfig)
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
};

type SignInType = {
    userId: string;
    userPw: string;
};
export const dhlSignIn = async ({ userId = '', userPw = '' }: SignInType) => {
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

type BuyLottoType = {
    dataList: (number[] | null)[];
};
export const dhlBuyLotto = async ({ dataList }: BuyLottoType) => {
    return await dhlSsrApi({
        url: `/buy-lotto`,
        method: POST,
        reqData: { dataList },
    });
};

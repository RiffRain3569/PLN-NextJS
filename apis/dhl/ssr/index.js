import axios from 'axios';
import * as HttpMethod from '../../../data/HttpMethod';

export const dhlSsrApi = async ({ url, method, reqData }) => {
    return await axios({
        method: method,
        url: `/api/dhl${url}`,
        headers: { 'Content-type': 'application/json' },
        data: method === HttpMethod.POST ? { ...reqData } : {},
        param: method === HttpMethod.GET ? { ...reqData } : {},
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
};

export const dhlSignIn = async ({ userId = '', userPw = '', jsessionId }) => {
    return await dhlSsrApi({
        url: `/sign-in`,
        method: HttpMethod.POST,
        reqData: { userId, userPw, jsessionId },
    });
};

export const dhlJsessionid = async ({ jsessionId }) => {
    return await dhlSsrApi({
        url: `/jsessionid`,
        method: HttpMethod.POST,
        reqData: { jsessionId },
    });
};

export const dhlBuyLotto = async ({ dataList, jsessionId }) => {
    return await dhlSsrApi({
        url: `/buy-lotto`,
        method: HttpMethod.POST,
        reqData: { dataList, jsessionId },
    });
};

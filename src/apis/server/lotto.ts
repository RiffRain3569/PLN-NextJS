import { GET, POST } from '@constants/httpMethod';
import axios, { AxiosRequestConfig } from 'axios';

export const lottoServerApi = async ({ url, method, reqData }: any) => {
    return await axios({
        method: method,
        baseURL: process.env.LOTTO_API_HOST,
        url: `${url}`,
        headers: { 'Content-type': 'application/json' },
        data: method === POST ? { ...reqData } : {},
        param: method === GET ? { ...reqData } : {},
    } as AxiosRequestConfig)
        .then((response) => {
            return response?.data;
        })
        .catch((error) => {
            throw error?.response?.data;
        });
};

type SelectLottoPredictType = {
    lottoId: number;
};
export const selectLottoPredict = async ({ lottoId }: SelectLottoPredictType) => {
    return await lottoServerApi({
        url: `/lottos/${lottoId}/predict`,
        method: GET,
    });
};

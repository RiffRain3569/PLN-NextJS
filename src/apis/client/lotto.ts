import { GET, POST } from '@constants/httpMethod';
import axios, { AxiosRequestConfig } from 'axios';

export const lottoServerApi = async ({ url, method, reqData }: any) => {
    return await axios({
        method: method,
        url: `/api/lotto${url}`,
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

type SelectLottoPredictType = {
    lottoId: number;
};
export const selectLottoPredict = async ({ lottoId }: SelectLottoPredictType) => {
    return await lottoServerApi({
        url: `/lottos/${lottoId}/predict`,
        method: GET,
    });
};

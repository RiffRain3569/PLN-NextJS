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

type StatsParams = {
    fromId: number;
    toId: number;
    includeBonus?: boolean;
};

const statsApi = async (path: string, params: Record<string, unknown>) => {
    return await axios({
        method: GET,
        baseURL: process.env.LOTTO_API_HOST,
        url: `/lottos/stats/${path}`,
        params,
    } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });
};

export const selectStatsFreq = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('freq', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const selectStatsSum = ({ fromId, toId }: StatsParams) =>
    statsApi('sum', { from_id: fromId, to_id: toId });

export const selectStatsOddEven = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('odd-even', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const selectStatsDigit = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('digit', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const selectStatsPairs = ({ fromId, toId }: StatsParams) =>
    statsApi('pairs', { from_id: fromId, to_id: toId });

export const selectStatsAc = ({ fromId, toId }: StatsParams) =>
    statsApi('ac', { from_id: fromId, to_id: toId });

import { GET, POST } from '@constants/httpMethod';
import axios, { AxiosRequestConfig } from 'axios';

export const fetchRounds = ({ cursor, limit = 20 }: { cursor?: number; limit?: number } = {}) =>
    axios({ method: GET, url: '/api/lotto/rounds', params: { cursor, limit } } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

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

type StatsParams = {
    fromId: number;
    toId: number;
    includeBonus?: boolean;
};

const statsClientApi = (path: string, params: Record<string, unknown>) =>
    axios({ method: GET, url: `/api/lotto/stats/${path}`, params } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

export const fetchStatsFreq = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsClientApi('freq', { fromId, toId, includeBonus });

export const fetchStatsSum = ({ fromId, toId }: StatsParams) =>
    statsClientApi('sum', { fromId, toId });

export const fetchStatsOddEven = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsClientApi('odd-even', { fromId, toId, includeBonus });

export const fetchStatsDigit = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsClientApi('digit', { fromId, toId, includeBonus });

export const fetchStatsPairs = ({ fromId, toId }: StatsParams) =>
    statsClientApi('pairs', { fromId, toId });

export const fetchStatsAc = ({ fromId, toId }: StatsParams) =>
    statsClientApi('ac', { fromId, toId });

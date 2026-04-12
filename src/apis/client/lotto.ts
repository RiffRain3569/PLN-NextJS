import { GET } from '@constants/httpMethod';
import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_LOTTO_API_HOST;

export const fetchRounds = ({ cursor, limit = 50 }: { cursor?: number; limit?: number } = {}) =>
    axios({ method: GET, url: `${BASE_URL}/api/lotto`, params: { cursor, limit } } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

type SelectLottoPredictType = {
    lottoId: number;
};
export const selectLottoPredict = async ({ lottoId }: SelectLottoPredictType) =>
    axios({ method: GET, url: `${BASE_URL}/api/lotto/${lottoId}/predict` } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

type StatsParams = {
    fromId: number;
    toId: number;
    includeBonus?: boolean;
};

const statsApi = (path: string, params: Record<string, unknown>) =>
    axios({ method: GET, url: `${BASE_URL}/api/lotto/stats/${path}`, params } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

export const fetchStatsFreq = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('freq', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const fetchStatsSum = ({ fromId, toId }: StatsParams) =>
    statsApi('sum', { from_id: fromId, to_id: toId });

export const fetchStatsOddEven = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('odd-even', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const fetchStatsDigit = ({ fromId, toId, includeBonus = false }: StatsParams) =>
    statsApi('digit', { from_id: fromId, to_id: toId, include_bonus: includeBonus });

export const fetchStatsPairs = ({ fromId, toId }: StatsParams) =>
    statsApi('pairs', { from_id: fromId, to_id: toId });

export const fetchStatsAc = ({ fromId, toId }: StatsParams) =>
    statsApi('ac', { from_id: fromId, to_id: toId });

type PredictParams = { cursor?: number; limit?: number };

export const fetchPredictExclude = ({ cursor, limit = 20 }: PredictParams = {}) =>
    axios({ method: GET, url: `${BASE_URL}/api/predict/feature/exclude`, params: { cursor, limit } } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

export const fetchPredictWeight = ({ cursor, limit = 20 }: PredictParams = {}) =>
    axios({ method: GET, url: `${BASE_URL}/api/predict/feature/weight`, params: { cursor, limit } } as AxiosRequestConfig)
        .then((r) => r.data)
        .catch((e) => { throw e?.response?.data; });

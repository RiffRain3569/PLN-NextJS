import { DH_SESSION } from '@constants/session';
import axios from 'axios';
import { NextResponse } from 'next/server';
import qs from 'qs';
// param: [
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'A' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'B' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'C' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'D' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'E' },
// ],

export const POST = async (req) => {
    const dhSession = req.cookies.get(DH_SESSION)?.value;
    const { dataList = [] } = await req.json();
    const alpabet = ['A', 'B', 'C', 'D', 'E'];

    // 부가 데이터 가져오기
    const preData = await axios
        .get('https://ol.dhlottery.co.kr/olotto/game/game645.do', {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
                Host: 'ol.dhlottery.co.kr',
            },
        })
        .then((response) => {
            const curRound = response.data.split('id="curRound">')?.at(1)?.split('<')[0];
            // const curBalance = response.data.split('id="moneyBalance">')?.at(1).split('<')[0].replace(',', '');
            const direct = response.data.split('direct" value="')?.at(1)?.split('"')[0];
            const drawData = response.data.split('ROUND_DRAW_DATE" value="')?.at(1)?.split('"')[0];
            const limitData = response.data.split('WAMT_PAY_TLMT_END_DT" value="')?.at(1)?.split('"')[0];
            return { curRound, direct, drawData, limitData };
        });

    if (!preData.curRound) {
        return NextResponse.json({ message: '구매할 수 없습니다.' }, { status: 501 });
    }

    // ready ip 데이터 가져오기
    const readyData = await axios
        .post('https://ol.dhlottery.co.kr/olotto/game/egovUserReadySocket.json', '', {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
                'Content-Type': 'application/json; charset=UTF-8',
                Host: 'ol.dhlottery.co.kr',
                Origin: 'https://ol.dhlottery.co.kr',
                Referer: 'https://ol.dhlottery.co.kr/olotto/game/game645.do',
            },
        })
        .then((response) => {
            return { direct: response.data.ready_ip };
        });

    if (!readyData.direct) {
        return NextResponse.json({ message: 'ip를 찾을 수 없습니다.' }, { status: 501 });
    }

    const body = {
        round: `${preData.curRound}`,
        direct: `${readyData.direct}`,
        nBuyAmount: String(dataList.length * 1000),
        param: `[${dataList
            .map((numList, key) =>
                JSON.stringify({
                    arrGameChoiceNum: numList === null ? null : numList.join(','),
                    genType: numList === null ? '0' : '1',
                    alpabet: alpabet[key],
                })
            )
            .join(',')}]`,
        ROUND_DRAW_DATE: `${preData.drawData}`,
        WAMT_PAY_TLMT_END_DT: `${preData.limitData}`,
        gameCnt: dataList.length,
    };

    console.log(body);
    console.log(qs.stringify(body));
    const result = await axios
        .post('https://www.dhlottery.co.kr/olotto/game/execBuy.do', qs.stringify(body), {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Host: 'ol.dhlottery.co.kr',
                Origin: 'https://ol.dhlottery.co.kr',
                Referer: 'https://ol.dhlottery.co.kr/olotto/game/game645.do',
            },
        })
        .then((response) => {
            const data = response.data.result;
            console.log(data);

            return { message: data?.arrGameChoiceNum?.join(' ') ?? data?.resultMsg };
        });
    return NextResponse.json(result);
};

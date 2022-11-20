import axios from 'axios';
import qs from 'qs';
// param: [
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'A' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'B' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'C' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'D' },
//     { arrGameChoiceNum: '8,18,20,27,32,38', genType: '1', alpabet: 'E' },
// ],

const handler = async (req, res) => {
    if (req.method != 'POST') {
        res.status(405);
        return;
    }
    const alpabet = ['A', 'B', 'C', 'D', 'E'];

    const { dataList = [], jsessionId } = JSON.parse(req.body);

    // 부가 데이터 가져오기
    const preData = await axios
        .get('https://ol.dhlottery.co.kr/olotto/game/game645.do', {
            headers: {
                Cookie: `JSESSIONID=${jsessionId}`,
                Host: 'ol.dhlottery.co.kr',
            },
        })
        .then((response) => {
            const curRound = response.data.split('id="curRound">')?.at(1).split('<')[0];
            // const curBalance = response.data.split('id="moneyBalance">')?.at(1).split('<')[0].replace(',', '');
            const direct = response.data.split('direct" value="')?.at(1).split('"')[0];
            const drawData = response.data.split('ROUND_DRAW_DATE" value="')?.at(1).split('"')[0];
            const limitData = response.data.split('WAMT_PAY_TLMT_END_DT" value="')?.at(1).split('"')[0];
            return { curRound, direct, drawData, limitData };
        });

    if (!preData.curRound) {
        res.status(501).json({ message: '구매할 수 없습니다.' });
        return;
    }

    // ready ip 데이터 가져오기
    const readyData = await axios
        .post('https://ol.dhlottery.co.kr/olotto/game/egovUserReadySocket.json', '', {
            headers: {
                Cookie: `JSESSIONID=${jsessionId}`,
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
        res.status(501).json({ message: 'ip를 찾을 수 없습니다.' });
        return;
    }

    const body = {
        round: `${preData.curRound}`,
        direct: `${readyData.direct}`,
        nBuyAmount: String(dataList.length * 1000),
        param: `[${dataList
            .map((numStr, key) =>
                JSON.stringify({
                    arrGameChoiceNum: numStr,
                    genType: numStr === null ? '0' : '1',
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
                Cookie: `JSESSIONID=${jsessionId}`,
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
    res.status(200).json(result);
};

export default handler;

import { DH_SESSION } from '@constants/session';
import axios from 'axios';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const dhSession = req.cookies.get(DH_SESSION)?.value;

    return await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
            },
        })
        .then((response) => {
            console.log('set-cookie', response.headers['set-cookie']);
            const resJsessionId = response.headers['set-cookie']
                .find((item) => item.includes('JSESSIONID'))
                ?.split('JSESSIONID=')[1]
                .split(';')[0];
            const resUid = response.headers['set-cookie']
                .find((item) => item.includes('UID'))
                ?.split('UID=')[1]
                .split(';')[0];
            const amount = response.data
                .split('/myPage.do?method=depositListView')
                .at(1)
                ?.split('<strong>')[1]
                .split('</strong>')[0]
                .slice(0, -2);
            console.log('amount', amount);
            let res = NextResponse.json({ uid: resUid ?? '', amount: amount ?? '' });
            res.cookies.set('dh_session', resJsessionId ?? dhSession);
            return res;
        });
};

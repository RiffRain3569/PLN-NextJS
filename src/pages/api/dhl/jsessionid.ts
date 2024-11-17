import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const dhSession = req.cookies['dh_session'];

    return await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
            },
        })
        .then((response: any) => {
            console.log('set-cookie', response.headers['set-cookie']);
            const resJsessionId = response.headers['set-cookie']
                .find((item: any) => item.includes('JSESSIONID'))
                ?.split('JSESSIONID=')[1]
                .split(';')[0];
            const resUid = response.headers['set-cookie']
                .find((item: any) => item.includes('UID'))
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

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    return await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: qs.stringify(req.cookies).split('&').join('; '),
            },
        })
        .then((response: any) => {
            console.log('set-cookie', response.headers['set-cookie']);
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
            res.status(200).json({ uid: resUid ?? '', amount: amount ?? '' });
        });
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

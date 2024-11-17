import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'url';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const dhSession = req.cookies['dh_session'];
    const { userId = '', userPw = '' } = await req.body;

    const body = new URLSearchParams();
    body.append('method', 'login');
    body.append('userId', userId);
    body.append('password', userPw);

    return await axios
        .post('https://www.dhlottery.co.kr/userSsl.do?method=login', body, {
            headers: {
                Cookie: `JSESSIONID=${dhSession}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'www.dhlottery.co.kr',
                Origin: 'https://www.dhlottery.co.kr',
                Referer: 'https://www.dhlottery.co.kr/user.do?method=login&returnUrl=%2F',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            },
        })
        .then((response: any) => {
            console.log('success', response.headers['set-cookie']);
            const uid = response.headers['set-cookie']
                .find((item: any) => item.includes('UID='))
                ?.split('UID=')[1]
                .split(';')[0];

            return uid
                ? res.json({ uid })
                : res.status(500).json({ error: 'Internal Server Error', message: '로그인에 실패하였습니다.' });
        });
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

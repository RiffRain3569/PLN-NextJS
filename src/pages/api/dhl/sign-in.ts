import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, userPw } = JSON.parse(req.body);

    const body = {
        userId: userId,
        password: userPw,
        token: '',
        returnUrl: '/',
        newsEventYn: '',
        checkSave: '',
    };

    console.log(qs.stringify(req.cookies).split('&').join('; ') + `; userId=${userId}`);
    await axios
        .post('https://www.dhlottery.co.kr/userSsl.do?method=login', qs.stringify(body), {
            headers: {
                Cookie: qs.stringify(req.cookies).split('&').join('; ') + `; userId=${userId}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'www.dhlottery.co.kr',
                Origin: 'https://www.dhlottery.co.kr',
                Referer: 'https://www.dhlottery.co.kr/user.do?method=login',
                Connection: 'keep-alive',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Upgrade-Insecure-Requests': 1,
            },
        })
        .then((response: AxiosResponse) => {
            const cookies = (response.headers as AxiosResponseHeaders)['set-cookie'] || [];

            console.log('success', cookies);

            res.setHeader(
                'Set-Cookie',
                cookies.map((cookie) => {
                    if (cookie.includes('Domain=.dhlottery.co.kr;'))
                        return cookie.replace('Domain=.dhlottery.co.kr;', '');
                    return cookie;
                })
            );
            const uid = cookies
                .find((item: any) => item.includes('UID='))
                ?.split('UID=')[1]
                .split(';')[0];

            if (!uid) {
                res.status(500).json({ error: 'Internal Server Error', message: '로그인에 실패하였습니다.' });
            }
            res.status(200).json({ uid });
        });
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

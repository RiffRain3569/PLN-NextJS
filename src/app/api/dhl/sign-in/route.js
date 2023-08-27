import { DH_SESSION } from '@constants/session';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { URLSearchParams } from 'url';

export const POST = async (req) => {
    const dhSession = req.cookies.get(DH_SESSION)?.value;
    const { userId = '', userPw = '' } = await req.json();

    const body = new URLSearchParams();
    body.append('method', 'login');
    body.append('userId', userId);
    body.append('password', userPw);

    return await axios
        .post('https://www.dhlottery.co.kr/userSsl.do', body, {
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
        .then((response) => {
            console.log(response.headers['set-cookie']);
            const uid = response.headers['set-cookie']
                .find((item) => item.includes('UID='))
                ?.split('UID=')[1]
                .split(';')[0];

            return uid
                ? NextResponse.json({ uid })
                : NextResponse.json(
                      { error: 'Internal Server Error', message: '로그인에 실패하였습니다.' },
                      { status: 500 }
                  );
        });
    // res.status(200).json();
};

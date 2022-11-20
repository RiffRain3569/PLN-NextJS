import { URLSearchParams } from 'url';
import axios from 'axios';

const handler = async (req, res) => {
    if (req.method != 'POST') {
        res.status(405);
        return;
    }

    const { userId = '', userPw = '', jsessionId } = JSON.parse(req.body);

    const body = new URLSearchParams();
    body.append('method', 'login');
    body.append('userId', userId);
    body.append('password', userPw);

    await axios
        .post('https://www.dhlottery.co.kr/userSsl.do', body, {
            headers: {
                Cookie: `JSESSIONID=${jsessionId}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'www.dhlottery.co.kr',
                Origin: 'https://www.dhlottery.co.kr',
                Referer: 'https://www.dhlottery.co.kr/user.do?method=login&returnUrl=%2F',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            },
        })
        .then((response) => {
            const uid = response.headers['set-cookie']
                .find((item) => item.includes('UID='))
                .split('UID=')[1]
                .split(';')[0];
            console.log(uid);
            uid ? res.status(200).json({ uid }) : res.status(500).json({ message: '로그인에 실패하였습니다.' });
        });
    // res.status(200).json();
};

export default handler;

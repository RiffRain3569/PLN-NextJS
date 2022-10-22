import axios from 'axios';
import qs from 'qs';

const handler = async (req, res) => {
    if (req.method != 'POST') {
        res.status(405);
        return;
    }

    const { userId = '', userPw = '' } = JSON.parse(req.body);

    console.log(userId, userPw);

    await axios({
        method: 'POST',
        url: 'https://www.dhlottery.co.kr/userSsl.do?method=login',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Host: 'www.dhlottery.co.kr',
            Origin: 'https://www.dhlottery.co.kr',
            Referer: 'https://www.dhlottery.co.kr/user.do?method=login&returnUrl=%2F',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
        },
        data: qs.stringify({ userId, password: userPw }),
    }).then((response) => {
        const jsessionId = response.headers['set-cookie'].find((item) => item.includes('JSESSIONID'));
        console.log('-----------------------------------------');
        console.log(response.headers, response.config);
        console.log(response.headers['set-cookie']);
        // console.log(response.data);
        console.log('-----------------------------------------');
    });
    // res.status(200).json(req.body);
};

export default handler;

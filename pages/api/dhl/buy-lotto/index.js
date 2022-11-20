import axios from 'axios';

const handler = async (req, res) => {
    if (req.method != 'GET') {
        res.status(405);
        return;
    }

    await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: `JSESSIONID=${req.params.jsessionId}`,
            },
        })
        .then((response) => {
            const jsessionId = response.headers['set-cookie']
                .find((item) => item.includes('JSESSIONID'))
                .split('JSESSIONID=')[1];
            res.status(200).json(jsessionId);
        });
};

export default handler;

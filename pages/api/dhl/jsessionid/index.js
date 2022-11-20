import axios from 'axios';

const handler = async (req, res) => {
    if (req.method != 'POST') {
        res.status(405);
        return;
    }

    const { jsessionId } = JSON.parse(req.body);
    console.log(jsessionId);
    await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: `JSESSIONID=${jsessionId}`,
            },
        })
        .then((response) => {
            console.log(response.headers['set-cookie']);
            const resJsessionId = response.headers['set-cookie'].find((item) => item.includes('JSESSIONID'));
            const resUid = response.headers['set-cookie'].find((item) => item.includes('UID'));

            res.status(200).json({
                jsessionId: resJsessionId?.split('JSESSIONID=')[1].split(';')[0] ?? jsessionId,
                uid: resUid?.split('UID=')[1].split(';')[0] ?? '',
            });
        });
};

export default handler;

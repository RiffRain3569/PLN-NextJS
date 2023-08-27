'use server';
import axios from 'axios';

const handler = async (req, res) => {
    if (req.method != 'POST') {
        res.status(405);
        return;
    }

    const { jsessionId } = JSON.parse(req.body);
    console.log('jsessionId', jsessionId, req.body);
    await axios
        .get('https://dhlottery.co.kr/common.do?method=main', {
            headers: {
                Cookie: `JSESSIONID=${jsessionId}`,
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
            res.status(200).json({
                jsessionId: resJsessionId ?? jsessionId,
                uid: resUid ?? '',
                amount: amount ?? '',
            });
        });
};

export default handler;

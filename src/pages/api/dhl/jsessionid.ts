import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookieHeader = qs.stringify(req.cookies).split('&').join('; ');

        const response = await axios.get('https://www.dhlottery.co.kr/mypage/selectUserMndp.do', {
            headers: { Cookie: cookieHeader },
        });

        const totalAmt = response.data?.data?.userMndp?.totalAmt ?? '';
        const amount = totalAmt ? Number(totalAmt).toLocaleString() : '';
        const userId = req.cookies.dhl_userId ?? '';

        // 로그인 중이면 dhl_userId 쿠키 갱신 (새로고침해도 유지)
        if (userId) {
            res.setHeader('Set-Cookie', `dhl_userId=${userId}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax`);
        }

        return res.status(200).json({ userId, amount });
    } catch (e) {
        console.error('dhl jsessionid error', e);
        return res.status(500).json({ message: '세션 확인에 실패하였습니다.' });
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

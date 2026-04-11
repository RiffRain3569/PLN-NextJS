import { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = 'admin_token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { password } = req.body;

        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
        }

        res.setHeader(
            'Set-Cookie',
            `${COOKIE_NAME}=true; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict`
        );
        return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`);
        return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
}

import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'DELETE') return;

    res.setHeader('Set-Cookie', [
        'DHJSESSIONID=; Path=/; Max-Age=0; SameSite=None; Secure',
        'dhl_userId=; Path=/; Max-Age=0; SameSite=Lax',
    ]);
    return res.status(200).json({ ok: true });
};

export default handler;

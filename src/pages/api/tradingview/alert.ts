import { NextApiRequest, NextApiResponse } from 'next';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req);
    console.log(req.body);
    return res.status(200).json({ message: 'ok' });
};
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;

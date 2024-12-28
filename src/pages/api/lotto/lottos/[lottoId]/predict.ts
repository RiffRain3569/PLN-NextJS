import { selectLottoPredict } from '@apis/server/lotto';
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const { lottoId } = req.query as { lottoId: string };
    const body = {
        lottoId: Number(lottoId),
    };

    return await selectLottoPredict(body)
        .then((response: any) => {
            res.status(200).json(response);
        })
        .catch((error: any) => {
            res.status(500).json(error);
        });
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        await GET(req, res);
    }
};

export default handler;

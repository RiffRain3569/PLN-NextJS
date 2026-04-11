import { selectLottos } from '@apis/server/lotto';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return;

    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    return await selectLottos({ cursor, limit })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json(error));
};

export default handler;

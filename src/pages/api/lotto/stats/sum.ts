import { selectStatsSum } from '@apis/server/lotto';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).end();
    const { fromId, toId } = req.query as Record<string, string>;
    return selectStatsSum({ fromId: Number(fromId), toId: Number(toId) })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err));
};

export default handler;

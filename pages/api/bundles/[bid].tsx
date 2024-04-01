import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';
import { getBundleById } from '@lib/dbs/mysql';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { bid },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const data = await getBundleById(parseInt(bid as string, 10));
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

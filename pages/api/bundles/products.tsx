// pages/api/products.ts
import { combineProductsBySubcategoryId } from '@lib/dbs/bundelMySql';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        method
    } = req;
    const { subcategoryId } = req.query;
    switch (method) {
        case 'GET':
            try {
                // const data = await getProductsBySubcategoryId(parseInt(subcategoryId as string, 10));
                const data = await combineProductsBySubcategoryId(parseInt(subcategoryId as string, 10));
                console.log("data", data)
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


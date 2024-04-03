import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';
import axios from 'axios';
import { deleteCategory } from '@lib/dbs/bundelMySql';

export default async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
    const {
        method
    } = req;
    const { categoryId, bcProductId } = req.query;
    switch (method) {
        case 'DELETE':
            try {
                // const data = await getProductsBySubcategoryId(parseInt(subcategoryId as string, 10));
                const data = await deleteCategory(parseInt(categoryId as string, 10));
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
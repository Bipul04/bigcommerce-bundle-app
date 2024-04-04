import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';
import axios from 'axios';
import { deleteCategory } from '@lib/dbs/bundelMySql';

const { API_URL } = process.env;

export default async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
    const {
        method
    } = req;
    const { categoryId, bcProductId } = req.query;
    const { accessToken, storeHash } = await getSession(req);

    switch (method) {
        case 'DELETE':
            try {
                const data = await deleteCategory(parseInt(categoryId as string, 10));
                if (data) {
                    await deleteProductFromBC(accessToken, storeHash, parseInt(bcProductId as string, 10));
                    res.status(200).json(data);
                }
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

async function deleteProductFromBC(accessToken: string, storeHash: string, bcProductId: number) {
    try {
        // // Assuming you have the necessary API credentials and endpoint
        await axios.delete(`https://${API_URL}/stores/${storeHash}/v3/catalog/products/${bcProductId}`, {
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("bc product delete error", error)
    }

}
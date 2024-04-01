// @lib/dbs/mysql.ts
import { getCategories } from '@lib/dbs/bundelMySql';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Extract page and limit from query parameters, with defaults
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const categories = await getCategories(page, limit);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching categories.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}



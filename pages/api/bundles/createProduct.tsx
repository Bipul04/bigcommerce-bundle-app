// pages/api/createProduct.js
import axios from 'axios';

import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // // Assuming you have the necessary API credentials and endpoint
            // const response = await axios.post('YOUR_BIGCOMMERCE_API_ENDPOINT', req.body, {
            //     headers: {
            //         'X-Auth-Token': 'YOUR_BIGCOMMERCE_API_TOKEN',
            //         'Content-Type': 'application/json',
            //     },
            // });
            const { accessToken, storeHash } = await getSession(req);
            const bigcommerce = bigcommerceClient(accessToken, storeHash);
            const { data } = await bigcommerce.get('/catalog/summary');


            // res.status(200).json(response.data);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


async function products(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get('/catalog/summary');
        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}

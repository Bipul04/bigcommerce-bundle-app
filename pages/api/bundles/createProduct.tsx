// pages/api/createProduct.js
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';
import axios from 'axios';
import { crateCategories } from '@lib/dbs/bundelMySql';

const { API_URL } = process.env;

let categoryData: BundleCategory = {
    name: '',
    price: 0,
    compared_price: 0,
    image_url: '',
    bc_product_id: ''
};

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        method,
    } = req;

    const { image, ...productData } = body;
    const { name, price, sale_price } = productData;
    categoryData = {
        ...categoryData,
        name: name,
        price: sale_price,
        compared_price: price,
    };

    if (method === 'POST') {
        try {
            const { accessToken, storeHash } = await getSession(req);

            // // Assuming you have the necessary API credentials and endpoint
            const response = await axios.post(`https://${API_URL}/stores/${storeHash}/v3/catalog/products`, productData, {
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json',
                },
            });
            // console.log("response", response.data.data);
            const uploadResult = await uploadImageFile(accessToken, storeHash, response.data.data.id, image)
            res.status(200).json(uploadResult);

        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function uploadImageFile(accessToken: string, storeHash: string, productId: string, imageBase64: any) {

    // Extract the filename from the Base64 string
    const base64Data = imageBase64.split(',')[1];
    const filename = imageBase64.split(',')[0].split(';')[1].split('=')[1];

    // Convert the Base64 string back to a Blob
    const byteCharacters = atob(base64Data) as string;
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('image_file', blob, filename);

    try {
        const response = await axios.post(`https://${API_URL}/stores/${storeHash}/v3/catalog/products/${productId}/images`, formData, {
            headers: {
                'X-Auth-Token': accessToken,
            },
        });

        const imageURl = response.data.data.url_standard;
        categoryData = {
            ...categoryData,
            bc_product_id: productId,
            image_url: imageURl
        };

        const mysqlResponse = await crateCategories(categoryData)

        return mysqlResponse;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}


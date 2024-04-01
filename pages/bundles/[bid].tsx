import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Form from '../../components/form';
import Loading from '../../components/loading';
import { useSession } from '../../context/session';
import { useProductInfo, useProductList } from '../../lib/hooks';
import { FormData } from '../../types';
import { Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';

const BundleInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const bid = Number(router.query?.bid);

    useEffect(() => {
        const fetchBundleDetails = async () => {
            try {
                const response = await fetch(`/api/bundles/${bid}`);
                const data = await response.json();
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchBundleDetails();
    }, []);

    const handleCancel = () => router.push('/bundles');

    const handleSubmit = async (data: FormData) => {
        try {
            router.push('/bundles');
        } catch (error) {
            console.error('Error updating the product: ', error);
        }
    };


    return (
        <Panel id='bundel'>
            <h1>Hello {bid}</h1>
        </Panel>
    );
};

export default BundleInfo;

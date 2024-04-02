import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useSession } from '../../context/session';
import { useProductInfo, useProductList } from '../../lib/hooks';
import { FormData } from '../../types';
import { Link, Panel, Table, Link as StyledLink, StatefulTable, MultiSelect } from '@bigcommerce/big-design';
import { ReactElement, useEffect, useState } from 'react';
import { Box, Button, Form, FormGroup, H1, Input, Select, Search } from '@bigcommerce/big-design';


const BundleInfo = () => {
    const [subCategoriesWithProducts, setSubCategoriesWithProducts] = useState<subCategoryData[]>([]);
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const bid = Number(router.query?.bid);

    useEffect(() => {
        const fetchBundleDetails = async () => {
            try {
                const response = await fetch(`/api/bundles/${bid}`);
                const data = await response.json();
                // Fetch products for each subcategory and assign them
                const subCategoriesWithProducts = await Promise.all(data.map(async (subCategory: any) => {
                    const response = await fetch(`/api/bundles/products?subcategoryId=${subCategory.id}`);
                    const products = await response.json();
                    return { ...subCategory, products };
                }));
                setSubCategoriesWithProducts(subCategoriesWithProducts);
                console.log("subCategoriesWithProducts", subCategoriesWithProducts)

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

    const renderName = (name: string): ReactElement => {
        const [email, setEmail] = useState(name);

        const handleChange = (e) => {
            setEmail(e.target.value);
        };
        return (
            <Form noValidate id='subcategory-name'>
                <FormGroup>
                    <Input
                        placeholder="Sub category"
                        required
                        type="text"
                        value={email}
                        onChange={handleChange}
                    />
                </FormGroup>
            </Form>
        );
    };

    const renderProductsData = (productDatas: ProductsData[]): ReactElement => {
        const [value, setValue] = useState('');
        const handleChange = (val) => setValue(val);
        const handleDeleteProduct = (productId: number) => {
            console.log(`Product with ID ${productId} will be deleted.`);
            // Implement actual deletion logic here
        };

        return (
            <Box marginBottom="medium">
                <Form>
                    <FormGroup>
                        <Select
                            filterable={true}
                            maxHeight={300}
                            onOptionChange={handleChange}
                            options={[
                                { value: 'ar', content: 'Argentina' },
                                { value: 'ru', content: 'Russia', disabled: true },
                            ]}
                            placeholder="Search for products..."
                            placement="bottom-start"
                            value={value}
                        />
                    </FormGroup>
                </Form>
                <Box marginTop="medium" marginBottom="medium">
                    <div>
                        {productDatas.map((product) => (
                            <div key={product.id} className="product-container">
                                <div className="product-wrapper">
                                    <h3 className="product-title">{product.name}</h3>
                                    <div className="varaint-wrapper">
                                        <ul className="variant-list">
                                            {product.variants.map((variant) => (
                                                <li key={variant.id} className="variant-item">
                                                    <img src={variant.image} alt={variant.name} className="variant-image" />
                                                    {variant.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="button-wrapper">
                                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
            </Box>
        );
    }

    return (
        <Panel header='Bundel Details' id='bundel'
            action={{
                variant: 'secondary',
                text: 'Add Sub Category',
                onClick: () => {
                    // Do some action
                },
            }}
        >
            <Table
                columns={[
                    { header: 'Sub category name', hash: 'name', render: ({ name }) => renderName(name), isSortable: true },
                    // { header: 'Category', hash: 'category_id', render: ({ category_id }) => category_id },
                    { header: 'Products', hash: 'products', render: ({ products }) => renderProductsData(products) },
                ]}
                items={subCategoriesWithProducts}
            />
        </Panel>
    );
};

export default BundleInfo;
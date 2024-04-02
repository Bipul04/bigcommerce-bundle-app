import { Link, Panel, Table, Link as StyledLink } from '@bigcommerce/big-design';

export default async function renderProducts(productDatas: ProductsData[]) {
    return (
        <Table
            headerless
            columns={[
                { header: 'Product name', hash: 'name', render: ({ name }) => name, isSortable: true },
                { header: 'Sorting', hash: 'sub_category_id', render: ({ sub_category_id }) => sub_category_id },
            ]}
            items={productDatas}
        />
    );
}

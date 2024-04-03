// pages/index.tsx
import { Button, Dropdown, Modal, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Item = {
    id: string;
    name: string;
    compared_price: string;
    price: string;
    bc_product_id: string;
};

export default function bundlesPage() {
    const [categories, setCategories] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPageOptions] = useState([10, 20, 30]);
    const [currentItems, setCurrentItems] = useState<Item[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [bcProductId, setBcProductId] = useState(0);

    const columns = [
        {
            header: 'id',
            hash: 'id',
            render: ({ id }) => id,
        },
        { header: 'Bundle name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
        { header: 'Compared price', hash: 'compared_price', render: ({ compared_price }) => renderPrice(compared_price) },
        { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true },
        { header: 'Action', hideHeader: true, hash: 'id', render: ({ id, bc_product_id }) => renderAction(id, bc_product_id) },
    ];

    const router = useRouter();

    const renderName = (id: number, name: string): ReactElement => (
        <Link href={`/bundles/${id}`}>
            <StyledLink>{name}</StyledLink>
        </Link>
    );

    const renderPrice = (price: number): string => (
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    );

    const renderAction = (id: number, bc_product_id: number): ReactElement => (
        <Dropdown
            items={[
                { content: 'Edit', onItemClick: () => console.log("edited"), hash: 'edit' },
                { content: 'Edit bundle', onItemClick: () => router.push(`/bundles/${id}`), hash: 'edit_bundle' },
                { content: 'Delete bundle', onItemClick: () => setDeleteCategory(id, bc_product_id), hash: 'delete' }
            ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    const setDeleteCategory = (id: number, bc_product_id: number) => {
        setIsDelete(true)
        setDeleteId(id)
        setBcProductId(bc_product_id)
    }

    const deleteCategory = async () => {
        try {


            const response = await fetch(`/api/bundles/deleteProduct?categoryId=${deleteId}&bcProductId=${bcProductId}`, {
                method: 'DELETE'
            });
            
            const deleteCategory = await response.json();
            console.log("deleteCategory", deleteCategory)

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/bundles/categories?page=${currentPage}&limit=${itemsPerPage}`);
                const data = await response.json();
                setCategories(data.data);
                setTotalItems(data.pagination.totalItems);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [currentPage, itemsPerPage]);

    const onItemsPerPageChange = (newRange) => {
        setCurrentPage(currentPage + 1);
        setItemsPerPage(newRange);
    };

    useEffect(() => {
        const maxItems = currentPage * itemsPerPage;
        const lastItem = Math.min(maxItems, categories.length);
        const firstItem = Math.max(0, maxItems - itemsPerPage);

        setCurrentItems(categories.slice(firstItem, lastItem));
    }, [currentPage, itemsPerPage, categories]);

    return (
        <>
            <Panel id="bundles"
                action={{
                    variant: 'primary',
                    text: 'Add Bundle',
                    onClick: () => {
                        router.push(`/bundles/add`)
                    },
                }}
                header="Bundles List"
            >
                <Table
                    columns={columns}
                    itemName="bundles"
                    items={currentItems}
                    keyField="id"
                    pagination={{
                        currentPage,
                        totalItems,
                        onPageChange: setCurrentPage,
                        itemsPerPageOptions,
                        onItemsPerPageChange,
                        itemsPerPage,
                    }}
                    stickyHeader
                />
            </Panel>

            <Modal
                actions={[
                    {
                        text: 'Cancel',
                        variant: 'subtle',
                        onClick: () => setIsDelete(false),
                    },
                    { text: 'Delete', onClick: () => deleteCategory() },
                ]}
                closeOnClickOutside={false}
                closeOnEscKey={true}
                header="Are you sure you want to delete this category?"
                isOpen={isDelete}
                onClose={() => setIsDelete(false)}
            >
            </Modal>
        </>
    );
}

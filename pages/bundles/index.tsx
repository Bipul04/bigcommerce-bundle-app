// pages/index.tsx
import { Button, Dropdown, Modal, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { alertsManager } from '@pages/_app';
import { errorAlert, renderName, renderPrice } from '@lib/custom/bundle';
import { useSession } from 'context/session';

export default function bundlesPage() {
    const [categories, setCategories] = useState<CategoriesItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPageOptions] = useState([10, 20, 30]);
    const [currentItems, setCurrentItems] = useState<CategoriesItem[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [bcProductId, setBcProductId] = useState(0);
    const router = useRouter();
    const encodedContext = useSession()?.context;
    
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

    const renderAction = (id: number, bc_product_id: number): ReactElement => (
        <Dropdown
            items={[
                { content: 'Edit', onItemClick: () => router.push(`/bundles/edit/${id}`), hash: 'edit' },
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
            const response = await fetch(`/api/bundles/deleteProduct?categoryId=${deleteId}&bcProductId=${bcProductId}&context=${encodedContext}`, {
                method: 'DELETE'
            });

            const deleteCategory = await response.json();
            if (deleteCategory.success) {
                fetchCategories();
                setIsDelete(false);
            } else {
                alertsManager.add(errorAlert);
                fetchCategories();
                setIsDelete(false);
            }

        } catch (error) {
            alertsManager.add(errorAlert);
            setIsDelete(false);
            console.error('Error fetching delete:', error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/bundles/categories?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();
            setCategories(data.data);
            setTotalItems(data.pagination.totalItems);
        } catch (error) {
            alertsManager.add(errorAlert);
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {

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

// pages/index.tsx
import { Button, Dropdown, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function bundlesPage() {
    const [categories, setCategories] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPageOptions] = useState([5, 10, 20, 30]);
    const [currentItems, setCurrentItems] = useState<Item[]>([]);
    type Item = {
        id: string;
        name: string;
        compared_price: string;
        price: string;
    };

    const columns = [
        {
            header: 'id',
            hash: 'id',
            render: ({ id }) => id,
        },
        { header: 'Bundle name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
        { header: 'Compared price', hash: 'compared_price', render: ({ compared_price }) => compared_price },
        { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true },
        { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id) },
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

    const renderAction = (id: number): ReactElement => (
        <Dropdown
            items={[{ content: 'Edit bundle', onItemClick: () => router.push(`/bundles/${id}`), hash: 'edit' }]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

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
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    useEffect(() => {
        const maxItems = currentPage * itemsPerPage;
        const lastItem = Math.min(maxItems, categories.length);
        const firstItem = Math.max(0, maxItems - itemsPerPage);

        setCurrentItems(categories.slice(firstItem, lastItem));
    }, [currentPage, itemsPerPage, categories]);

    return (
        <Panel id="bundles">
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
    );
}
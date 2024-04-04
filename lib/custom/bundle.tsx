import { AlertProps, Link } from "@bigcommerce/big-design";
import { Button, Dropdown, Modal, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import router from "next/router";
import { ReactElement } from "react";


export const errorAlert: AlertProps = {
    messages: [
        {
            text: 'Something went wrong, please try again later',
        },
    ],
    type: 'error',
    onClose: () => null,
};

export const renderName = (id: number, name: string): ReactElement => (
    <Link href={`/bundles/${id}`}>
        <StyledLink>{name}</StyledLink>
    </Link>
);

export const renderPrice = (price: number): string => (
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
);



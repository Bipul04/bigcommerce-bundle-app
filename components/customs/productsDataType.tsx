// type ProductsData = {
//     id: number;
//     name: string;
//     sub_category_id: number;
// }

interface ProductsData {
    id: number;
    name: string;
    sub_category_id: number;
    variants: {
        id: number;
        name: string;
        price: number;
        image: string;
    }[];
}

interface ProductListProps {
    products: ProductsData[];
}

type subCategoryData = {
    name: string;
    category_id: number;
    products: ProductsData[];
};

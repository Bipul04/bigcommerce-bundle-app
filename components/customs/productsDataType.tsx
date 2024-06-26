type CategoriesItem = {
    id: string;
    name: string;
    compared_price: string;
    price: string;
    bc_product_id: string;
};

interface BundleFormData {
    name: string;
    price: string;
    compared_price: string;
    image: FileList;
}

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


type BundleCategory = {
    name: string;
    price: number;
    compared_price: number;
    image_url: string;
    bc_product_id: string;
}
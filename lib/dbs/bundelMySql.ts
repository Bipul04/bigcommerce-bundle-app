import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2';
import { RowDataPacket } from 'mysql2/promise';


const MYSQL_CONFIG: PoolOptions = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    ...(process.env.MYSQL_PORT && { port: Number(process.env.MYSQL_PORT) }),
};

const pool = mysql.createPool(MYSQL_CONFIG);
// Function to get categories with pagination
export async function getCategories(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM categories LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM categories');
        const totalPages = Math.ceil(totalRows[0].count / limit);

        return {
            data: rows,
            pagination: {
                totalPages,
                currentPage: page,
                totalItems: totalRows[0].count,
                itemsPerPage: limit,
            },
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getProductsBySubcategoryId(subcategoryId: number) {
    const [results] = await pool.query('SELECT * FROM products WHERE sub_category_id = ?', subcategoryId);
    return results;
};

export async function combineProductsBySubcategoryId(subcategoryId: number): Promise<any> {
    try {
        // Query for products
        const [productResults] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE sub_category_id = ?', [subcategoryId]);

        // Check if there are any products for the given subcategory
        if (productResults.length === 0) {
            return [];
        }

        const products: any[] = productResults.map((product) => ({
            ...product,
            variants: [],
        }));

        // Extract product IDs for the IN clause
        const productIds = productResults.map((product) => product.id);
        // Query for variants
        const [variantResults] = await pool.query<RowDataPacket[]>('SELECT * FROM variants WHERE product_id IN (?)', [productIds]);

        // Check if there are any variants for the products
        if (variantResults.length === 0) {
            console.log(`No variants found for products in subcategory ID: ${subcategoryId}`);
            // Optionally, you can return the products without variants if that's acceptable for your use case
        }

        // Map variant results to Variant type and add to corresponding product
        variantResults.forEach((variant) => {
            const productIndex = products.findIndex((product) => product.id === variant.product_id);
            if (productIndex !== -1) {
                products[productIndex].variants.push(variant);
            }
        });

        return products;
    } catch (error) {
        console.error(`Error combining products by subcategory ID: ${subcategoryId}`, error);
        throw error; // Rethrow the error or handle it as needed
    }
}


export async function crateCategories(categoryData: BundleCategory) {
    const [results] = await pool.execute(
        'INSERT INTO categories (name, price, compared_price, image, bc_product_id) VALUES (?, ?, ? ,?, ?)',
        [categoryData.name, categoryData.price, categoryData.compared_price, categoryData.image_url, categoryData.bc_product_id]
    );
    return results;
}


// export async function deleteCategory(categoryId: number) {
//     await pool.execute(
//         `DELETE subcategories, products, variants
//          FROM subcategories
//          LEFT JOIN products ON subcategories.id = products.subcategory_id
//          LEFT JOIN variants ON products.id = variants.product_id
//          WHERE subcategories.category_id = ?;
//          DELETE FROM categories WHERE id = ?;`,
//         [categoryId, categoryId]
//     );
// }

export async function deleteCategory(categoryId: number): Promise<{ success: boolean; message: string }> {
    try {
        // Step 1: Delete from variants if any exist
        await pool.execute(
            `DELETE FROM variants WHERE product_id IN (
                SELECT id FROM products WHERE sub_category_id IN (
                    SELECT id FROM sub_categories WHERE category_id = ?
                )
            );`,
            [categoryId]
        );

        // Step 2: Delete from products if any exist
        await pool.execute(
            `DELETE FROM products WHERE sub_category_id IN (
                SELECT id FROM sub_categories WHERE category_id = ?
            );`,
            [categoryId]
        );

        // Step 3: Delete from sub_categories if any exist
        await pool.execute(
            `DELETE FROM sub_categories WHERE category_id = ?;`,
            [categoryId]
        );

        // Step 4: Delete from categories
        await pool.execute(
            `DELETE FROM categories WHERE id = ?;`,
            [categoryId]
        );

        return { success: true, message: 'Category and all related data deleted successfully.' };
    } catch (error) {
        // Rollback the transaction in case of error
        console.error('Error deleting category:', error);

        // Return error response
        return { success: false, message: 'Error deleting category: ' + error.message };
    }
}




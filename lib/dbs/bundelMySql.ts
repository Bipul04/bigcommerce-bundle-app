import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2';

const MYSQL_CONFIG: PoolOptions = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    ...(process.env.MYSQL_PORT && { port: Number(process.env.MYSQL_PORT) }),
};

// Function to get categories with pagination
export async function getCategories(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    try {
        const pool = mysql.createPool(MYSQL_CONFIG);
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


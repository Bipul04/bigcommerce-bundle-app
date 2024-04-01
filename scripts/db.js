const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();

const MYSQL_CONFIG = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    ...(process.env.MYSQL_PORT && { port: process.env.MYSQL_PORT }),
};

const connection = mysql.createConnection(process.env.DATABASE_URL ? process.env.DATABASE_URL : MYSQL_CONFIG);
const query = util.promisify(connection.query.bind(connection));

const usersCreate = query('CREATE TABLE `users` (\n' +
    '  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n' +
    '  `userId` int(11) NOT NULL,\n' +
    '  `email` text NOT NULL,\n' +
    '  `username` text,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `userId` (`userId`)\n' +
    ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n'
);

const storesCreate = query('CREATE TABLE `stores` (\n' +
    '  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n' +
    '  `storeHash` varchar(10) NOT NULL,\n' +
    '  `accessToken` text,\n' +
    '  `scope` text,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `storeHash` (`storeHash`)\n' +
    ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;'
);

const storeUsersCreate = query('CREATE TABLE `storeUsers` (\n' +
    '  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n' +
    '  `userId` int(11) NOT NULL,\n' +
    '  `storeHash` varchar(10) NOT NULL,\n' +
    '  `isAdmin` boolean,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `userId` (`userId`,`storeHash`)\n' +
    ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n'
);

const categoriesCreate = query(`
CREATE TABLE \`categories\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`name\` varchar(255) NOT NULL,\`price\` decimal(10, 2) NOT NULL,
 \`compared_price\` decimal(10, 2),
 \`image\` varchar(255),
 PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

const subCategoriesCreate = query(`
CREATE TABLE \`sub_categories\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`name\` varchar(255) NOT NULL,
 \`category_id\` int(11) unsigned NOT NULL,
 PRIMARY KEY (\`id\`),
 FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

const productsCreate = query(`
CREATE TABLE \`products\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`name\` varchar(255) NOT NULL,
 \`sub_category_id\` int(11) unsigned NOT NULL,
 PRIMARY KEY (\`id\`),
 FOREIGN KEY (\`sub_category_id\`) REFERENCES \`sub_categories\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

const variantsCreate = query(`
CREATE TABLE \`variants\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`name\` varchar(255) NOT NULL,
 \`price\` decimal(10, 2) NOT NULL,
 \`compared_price\` decimal(10, 2),
 \`image\` varchar(255),
 \`quantity\` int(11) NOT NULL,
 \`product_id\` int(11) unsigned NOT NULL,
 PRIMARY KEY (\`id\`),
 FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);


const storeProductLinkCreate = query(`
CREATE TABLE \`store_product_link\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`store_id\` int(11) unsigned NOT NULL,
 \`product_id\` int(11) unsigned NOT NULL,
 PRIMARY KEY (\`id\`),
 FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`),
 FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

const storeCategoryLinkCreate = query(`
CREATE TABLE \`store_category_link\` (
 \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
 \`store_id\` int(11) unsigned NOT NULL,
 \`category_id\` int(11) unsigned NOT NULL,
 PRIMARY KEY (\`id\`),
 FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`),
 FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);


Promise.all([categoriesCreate, subCategoriesCreate, productsCreate, variantsCreate, storeCategoryLinkCreate]).then(() => {
    connection.end();
});

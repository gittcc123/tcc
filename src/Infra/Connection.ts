import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não foi definida no arquivo .env');
}

export const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
});

connection.on('error', (err) => {
    console.error('Erro inesperado no pool PostgreSQL:', err.message);
});

export default connection;
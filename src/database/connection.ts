import { createPool, Pool } from 'mysql2/promise';

export const connect = async (): Promise<Pool> => {

    const connection = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'recipes',
        connectionLimit: 10
    });

    return connection;

}
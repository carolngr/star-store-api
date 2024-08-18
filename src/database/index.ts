import { Client } from "pg";

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const query = async <Item = any>(
  _query: string,
  values?: any[]
): Promise<Item[]> => {
  try {
    const { rows } = await client.query(_query, values);
    return rows;
  } catch (error) {
    console.error("Query failed:", error);
    throw error;
  }
};

export default { query, client };


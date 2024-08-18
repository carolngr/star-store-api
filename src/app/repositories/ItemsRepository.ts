import db from "../../database";
import { ICreateItemsDTO } from "../controllers/items/dtos/createDTO";
import isValidUUID from "../utils/isValidUUID";
import {
  Item,
  ItemsRepositoryContract,
} from "./contracts/ItemsRepositoryContract";

class ItemsRepository implements ItemsRepositoryContract {
  async findAll(orderBy = "asc"): Promise<Item[]> {
    const direction = orderBy.toLowerCase() === "desc" ? "DESC" : "ASC";
    const rows = await db.query<Item>(`
      SELECT * FROM items ORDER BY title ${direction}
    `);
    return rows;
  }

  async findById(id: string): Promise<Item | null> {
    if (!isValidUUID(id)) return null;
    const rows = await db.query<Item>("SELECT * FROM items WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }

  async create({
    title,
    price,
    thumbnail_hd,
    seller,
  }: Omit<Item, "id" | "created_at" | "updated_at">): Promise<Item> {
    const rows = await db.query<Item>(
      `INSERT INTO items (title, price, thumbnail_hd, seller)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, price, thumbnail_hd, seller]
    );
    return rows[0];
  }

  async createMany(items: ICreateItemsDTO[]): Promise<Item> {
    const query = `
    INSERT INTO items (title, price, thumbnail_hd, seller)
    VALUES ${items
      .map(
        (_, index) =>
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
            index * 4 + 4
          })`
      )
      .join(", ")}
    RETURNING *;
  `;
    const values = items.flatMap((item) => [
      item.title,
      item.price,
      item.thumbnail_hd,
      item.seller,
    ]);

    const rows = await db.query<Item>(query, values);
    return rows[0];
  }

  async update(
    id: string,
    data: Partial<Omit<Item, "id" | "seller" | "created_at">>
  ): Promise<Item | null> {
    const { title, price, thumbnail_hd } = data;
    const rows = await db.query<Item>(
      `UPDATE items
       SET title = $1, price = $2, thumbnail_hd = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, price, thumbnail_hd, id]
    );
    return rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.query<Item>("DELETE FROM items WHERE id = $1", [id]);
  }
}

export default new ItemsRepository();


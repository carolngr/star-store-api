import db from "../../database";
import { Card } from "../entities/Card";
import isValidUUID from "../utils/isValidUUID";
import { CardRepositoryContract } from "./contracts/CardRepositoryContract";

class CardRepository implements CardRepositoryContract {
  async findAll(orderBy = "asc", user_id?: string): Promise<Card[]> {
    const direction = orderBy.toLowerCase() === "desc" ? "DESC" : "ASC";
    const rows = await db.query<Card>(
      `SELECT * FROM cards WHERE user_id = $1 ORDER BY main_card ${direction}`,
      [user_id]
    );
    return rows;
  }

  async findById(id: string): Promise<Card | null> {
    if (!isValidUUID(id)) return null;
    const rows = await db.query<Card>("SELECT * FROM cards WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }

  async create({
    cvv,
    title,
    number,
    user_id,
    main_card,
    valid_date,
  }: Omit<Card, "id" | "created_at" | "updated_at">): Promise<Card> {
    const rows = await db.query<Card>(
      `INSERT INTO cards (number, title, cvv, valid_date, main_card, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [number, title, cvv, valid_date, main_card, user_id]
    );
    return rows[0];
  }

  async update(
    card: Partial<Omit<Card, "id" | "created_at" | "updated_at">>,
    card_id: string
  ): Promise<Card> {
    const { title, cvv, number, main_card, valid_date } = card;

    const rows = await db.query<Card>(
      `UPDATE cards
      SET number = $1, cvv = $2, valid_date = $3, main_card = $4, title = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [number, cvv, valid_date, main_card, title, card_id]
    );
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await db.query<Card>("DELETE FROM cards WHERE id = $1", [id]);
  }
}

export default new CardRepository();


import { Card } from "../../entities/Card";

export interface CardRepositoryContract {
  findAll(orderBy?: string, user_id?: string): Promise<Card[]>;
  create(data: Omit<Card, "id" | "created_at" | "updated_at">): Promise<Card>;
  findById(id: string): Promise<Card | null>;
  update(
    card: Partial<Omit<Card, "id" | "created_at" | "updated_at">>,
    card_id: string
  ): Promise<Card | null>;
  delete(id: string): Promise<void>;
}


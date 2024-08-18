import { Card } from "../../../entities/Card";

export interface ICreateDTO
  extends Omit<Card, "id" | "user_id" | "createdAt" | "updatedAt"> {}


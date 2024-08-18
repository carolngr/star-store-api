import { User } from "../../entities/User";

export interface UserCreate
  extends Omit<User, "id" | "createdAt" | "updatedAt"> {}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}


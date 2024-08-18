import { Address } from "../../../entities/Address";

export interface ICreateDTO
  extends Omit<Address, "id" | "user_id" | "createdAt" | "updatedAt"> {}


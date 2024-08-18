import { Address } from "../../entities/Address";

export interface AddressRepositoryContract {
  findAll(orderBy?: string, user_id?: string): Promise<Address[]>;
  create(
    data: Omit<Address, "id" | "created_at" | "updated_at">,
    user_id: string
  ): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  update(
    address: Partial<Omit<Address, "id" | "created_at" | "updated_at">>,
    address_id: string
  ): Promise<Address | null>;
  delete(id: string): Promise<void>;
}


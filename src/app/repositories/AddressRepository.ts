import db from "../../database";
import { Address } from "../entities/Address";
import { AddressRepositoryContract } from "./contracts/AddressRepositoryContract";

class AddressRepository implements AddressRepositoryContract {
  async findAll(orderBy = "asc", user_id?: string): Promise<Address[]> {
    const direction = orderBy.toLowerCase() === "desc" ? "DESC" : "ASC";
    const rows = await db.query<Address>(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at ${direction}`,
      [user_id]
    );
    return rows;
  }

  async findById(id: string): Promise<Address | null> {
    const rows = await db.query<Address>(
      "SELECT * FROM addresses WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  async create(
    {
      city,
      country,
      postal_code,
      state,
      street,
    }: Omit<Address, "id" | "created_at" | "updated_at">,
    user_id: string
  ): Promise<Address> {
    const rows = await db.query<Address>(
      `INSERT INTO addresses (city, country, postal_code, state, street, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [city, country, postal_code, state, street, user_id]
    );
    return rows[0];
  }

  async update(
    address: Partial<Omit<Address, "id" | "created_at" | "updated_at">>,
    address_id: string
  ): Promise<Address> {
    const { city, country, postal_code, state, street } = address;

    const rows = await db.query<Address>(
      `UPDATE addresses
      SET city = $1, country = $2, postal_code = $3, state = $4, street = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [city, country, postal_code, state, street, address_id]
    );
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await db.query<Address>("DELETE FROM addresses WHERE id = $1", [id]);
  }
}

export default new AddressRepository();

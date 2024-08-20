import db from "../../database";
import { UserCreate, UserUpdate } from "./contracts/UserRepositoryContract";
import isValidUUID from "../utils/isValidUUID";
import { User } from "../entities/User";

class UsersRepository {
  async findAll(orderBy: string = "asc"): Promise<User[]> {
    const direction = orderBy.toLowerCase() === "desc" ? "DESC" : "ASC";
    const rows = await db.query<User>(`
      SELECT * FROM users ORDER BY name ${direction}
    `);
    return rows;
  }

  async findById(id: string): Promise<User | null> {
    if (!isValidUUID(id)) return null;
    const rows = await db.query<User>("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await db.query<User>("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0] || null;
  }

  async create(user: UserCreate): Promise<User> {
    const { name, email, password } = user;
    const rows = await db.query<User>(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [name, email, password]
    );
    return rows[0];
  }

  async update(id: string, userUpdate: UserUpdate): Promise<User | null> {
    if (!isValidUUID(id)) return null;
    const { name, email, password } = userUpdate;
    const rows = await db.query<User>(
      `UPDATE users
      SET name = $1, email = $2, password = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *`,
      [name, email, password, id]
    );
    return rows[0] || null;
  }

  async updateRegister(
    id: string,
    userUpdate: UserUpdate
  ): Promise<User | null> {
    if (!isValidUUID(id)) return null;
    const { name, email, password } = userUpdate;
    const rows = await db.query<User>(
      `UPDATE users
      SET name = $1, email = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
      [name, email, id]
    );
    return rows[0] || null;
  }
}

export default new UsersRepository();

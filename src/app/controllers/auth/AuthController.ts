import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersRepository from "../../repositories/UsersRepository";
import { AuthRequest } from "../../types/AuthRequest";
import { CreateUserDTO } from "./dtos/registerDTO";

class AuthController {
  async login(request: Request, response: Response): Promise<Response> {
    const { email, password }: { email: string; password: string } =
      request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required" });
    }
    const user = await UsersRepository.findByEmail(email);
    if (!user) {
      return response.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );
    return response.json({ token });
  }

  async register(request: Request, response: Response): Promise<Response> {
    const { name, email, password }: CreateUserDTO = request.body;

    if (!name || !email || !password) {
      return response
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existingUser = await UsersRepository.findByEmail(email);

    if (existingUser) {
      return response
        .status(400)
        .json({ error: "This email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UsersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    return response.status(201).json({ token });
  }

  async me(request: AuthRequest, response: Response): Promise<Response> {
    const { userId } = request;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const user = await UsersRepository.findById(userId);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.json({ id: user.id, name: user.name, email: user.email });
  }
}

export default new AuthController();


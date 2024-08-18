import { Request, Response } from "express";

import UsersRepository from "../../repositories/UsersRepository";
import isValidUUID from "../../utils/isValidUUID";

class UsersController {
  async index(
    request: Request<any, any, any, { orderBy: "asc" | "desc" }>,
    response: Response
  ) {
    const { orderBy } = request.query;
    const users = await UsersRepository.findAll(orderBy);
    response.json(users);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "User not found!" });
    }

    const user = await UsersRepository.findById(id);

    if (!user) {
      return response.status(404).json({ error: "User not found!" });
    }

    response.json(user);
  }

  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    if (email) {
      const userByEmail = await UsersRepository.findByEmail(email);
      if (userByEmail) {
        return response
          .status(400)
          .json({ error: "This e-mail is already in use" });
      }
    }
    const user = await UsersRepository.create({ name, email, password });
    response.status(201).json(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, password } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid user id" });
    }

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    const userExist = await UsersRepository.findById(id);
    if (!userExist) {
      return response.status(404).json({ error: "User not found" });
    }

    const userByEmail = await UsersRepository.findByEmail(email);
    if (userByEmail && userByEmail.id !== id) {
      return response
        .status(400)
        .json({ error: "This e-mail is already in use" });
    }

    const user = await UsersRepository.update(id, { name, email, password });
    response.json(user);
  }
}

export default new UsersController();


import { Request, Response } from "express";
import AddressRepository from "../../repositories/AddressRepository";
import { AuthRequest } from "../../types/AuthRequest";
import { ICreateDTO } from "./dtos/createDTO";
import isValidUUID from "../../utils/isValidUUID";

class CardsController {
  async index(request: AuthRequest, response: Response) {
    if (!request.userId) {
      return response.status(400).send({ message: "User not found" });
    }
    const { orderBy } = request.query as { orderBy: "asc" | "desc" };
    const items = await AddressRepository.findAll(
      orderBy,
      request.userId ?? ""
    );
    response.json(items);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid address id" });
    }
    const item = await AddressRepository.findById(id);
    if (!item) {
      return response.status(404).json({ error: "Address not found!" });
    }
    response.json(item);
  }

  async store(request: AuthRequest, response: Response) {
    const { userId } = request;
    const { city, country, postal_code, state, street } =
      request.body as ICreateDTO;
    if (!city || !country || !postal_code || !state || !street) {
      return response.status(400).json({
        error: "city, country, postal_code, state, street are required",
      });
    }
    if (!userId) {
      return response.status(400).json({ error: "User id is required" });
    }

    const item = await AddressRepository.create(
      {
        city,
        country,
        postal_code,
        state,
        street,
      },
      userId
    );
    response.status(201).json(item);
  }

  async update(request: AuthRequest, response: Response) {
    const { id } = request.params;
    const { city, country, postal_code, state, street } =
      request.body as Partial<ICreateDTO>;
    if (!city || !country || !postal_code || !state || !street) {
      return response
        .status(400)
        .json({ error: "cvv, number, user_id, title are required" });
    }

    const item = await AddressRepository.update(
      {
        city,
        country,
        postal_code,
        state,
        street,
      },
      id
    );
    response.status(201).json(item);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid address id" });
    }
    await AddressRepository.delete(id);
    response.sendStatus(204);
  }
}

export default new CardsController();


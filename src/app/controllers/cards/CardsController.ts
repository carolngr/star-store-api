import { Request, Response } from "express";
import CardRepository from "../../repositories/CardRepository";
import { AuthRequest } from "../../types/AuthRequest";
import { ICreateDTO } from "./dtos/createDTO";
import isValidUUID from "../../utils/isValidUUID";

class CardsController {
  async index(request: AuthRequest, response: Response) {
    if (!request.userId) {
      return response.status(400).send({ message: "User not found" });
    }
    const { orderBy } = request.query as { orderBy: "asc" | "desc" };
    const items = await CardRepository.findAll(orderBy, request.userId ?? "");
    response.json(items);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid card id" });
    }
    const item = await CardRepository.findById(id);
    if (!item) {
      return response.status(404).json({ error: "Card not found!" });
    }
    response.json(item);
  }

  async store(request: AuthRequest, response: Response) {
    const { userId } = request;
    const { cvv, number, valid_date, main_card, title } =
      request.body as ICreateDTO;
    if (!cvv || !number || !valid_date || !title) {
      return response
        .status(400)
        .json({ error: "cvv, number, user_id, title are required" });
    }
    if (!userId) {
      return response.status(400).json({ error: "User id is required" });
    }

    const item = await CardRepository.create({
      cvv,
      number,
      title,
      user_id: userId,
      main_card,
      valid_date,
    });
    response.status(201).json(item);
  }

  async update(request: AuthRequest, response: Response) {
    const { id } = request.params;
    const { cvv, number, valid_date, main_card, title } =
      request.body as Partial<ICreateDTO>;
    if (!cvv || !number || !valid_date || !title) {
      return response
        .status(400)
        .json({ error: "cvv, number, user_id, title are required" });
    }

    const item = await CardRepository.update(
      {
        cvv,
        number,
        main_card,
        valid_date,
        title,
      },
      id
    );
    response.status(201).json(item);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid card id" });
    }
    await CardRepository.delete(id);
    response.sendStatus(204);
  }
}

export default new CardsController();


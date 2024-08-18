import { Request, Response } from "express";
import ItemsRepository from "../../repositories/ItemsRepository";
import isValidUUID from "../../utils/isValidUUID";
import { ICreateItemsDTO } from "./dtos/createDTO";

class ItemsController {
  async index(
    request: Request<any, any, any, { orderBy: "asc" | "desc" }>,
    response: Response
  ) {
    const { orderBy } = request.query;
    const items = await ItemsRepository.findAll(orderBy);
    response.json(items);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid item id" });
    }
    const item = await ItemsRepository.findById(id);
    if (!item) {
      return response.status(404).json({ error: "Item not found!" });
    }
    response.json(item);
  }

  async store(request: Request<any, any, ICreateItemsDTO>, response: Response) {
    const { title, price, thumbnail_hd, seller } = request.body;
    if (!title || !price) {
      return response
        .status(400)
        .json({ error: "Title and price are required" });
    }
    if (!seller) {
      return response.status(400).json({ error: "Required Seller name" });
    }
    const item = await ItemsRepository.create({
      title,
      price,
      thumbnail_hd,
      seller,
    });
    response.status(201).json(item);
  }

  async createMany(request: Request, response: Response) {
    const { items } = request.body as { items: ICreateItemsDTO[] };

    if (!items.length) {
      return response.status(400).json({ error: "Required item" });
    }
    items.map(async (item) => {
      const { price, seller, title } = item;
      if (!title || !price) {
        return response
          .status(400)
          .json({ error: "Title and price are required" });
      }
      if (!seller) {
        return response.status(400).json({ error: "Required Seller name" });
      }
    });

    await ItemsRepository.createMany(items);
    response.status(201).json({ message: "Created all items" });
  }

  async update(
    request: Request<any, any, ICreateItemsDTO>,
    response: Response
  ) {
    const { id } = request.params;
    const { title, price, thumbnail_hd } = request.body;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid item id" });
    }
    if (!title || !price) {
      return response
        .status(400)
        .json({ error: "Title and price are required" });
    }
    const itemExist = await ItemsRepository.findById(id);
    if (!itemExist) {
      return response.status(404).json({ error: "Item not found" });
    }
    const item = await ItemsRepository.update(id, {
      title,
      price,
      thumbnail_hd,
    });
    response.json(item);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid item id" });
    }
    await ItemsRepository.delete(id);
    response.sendStatus(204);
  }
}

export default new ItemsController();


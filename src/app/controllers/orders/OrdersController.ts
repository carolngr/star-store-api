import { Response } from "express";

import OrdersRepository from "../../repositories/OrdersRepository";
import { AuthRequest } from "../../types/AuthRequest";
import { ICreateDTO } from "./dtos/createDTO";
import AddressRepository from "../../repositories/AddressRepository";
import CardRepository from "../../repositories/CardRepository";
import { IOrderRepositoryCreateDTO } from "../../repositories/contracts/OrdersRepositoryContract";
import { Order } from "../../entities/Order";
import OrderItemsRepository from "../../repositories/OrderItemsRepository";

class OrdersController {
  async index(request: AuthRequest, response: Response): Promise<Response> {
    try {
      const orders = await OrdersRepository.findAllByUserId(
        request.userId ?? ""
      );
      const ordersWithItems = await Promise.all(
        orders.map(async (order: Order) => {
          const items = await OrderItemsRepository.findByOrderId(order.id);
          return {
            ...order,
            shipping_value: Number(order.shipping_value),
            sub_total_value: Number(order.sub_total_value),
            total_value: Number(order.total_value),
            items: items.map((item) => ({
              ...item,
              amount: item.quantity,
            })),
          };
        })
      );
      return response.json(ordersWithItems);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async store(request: AuthRequest, response: Response): Promise<Response> {
    const body = request.body as ICreateDTO;
    const user_id = request.userId ?? "";
    if (!body.address || !body.card) {
      return response
        .status(400)
        .json({ error: "address_id and card_id are required!" });
    }
    const { address, card } = body;
    const sub_total_value = body.items.reduce((preview, current) => {
      return Math.min(current.price * current.quantity) + preview;
    }, 0);
    const total_value = sub_total_value + body.shipping_value;

    const createArgs: IOrderRepositoryCreateDTO = {
      user_id,
      status: body.status,
      shipping_value: body.shipping_value,
      sub_total_value,
      total_value,
      address_city: address.city,
      address_country: address.country,
      address_postal_code: address.postal_code,
      address_state: address.state,
      address_street: address.street,
      card_cvv: card.cvv,
      card_main_card: card.main_card,
      card_number: card.number,
      card_title: card.title,
      card_valid_date: card.valid_date,
      items: body.items,
    };
    const order = await OrdersRepository.create(createArgs, user_id);
    return response.status(201).json(order);
  }
}
export default new OrdersController();

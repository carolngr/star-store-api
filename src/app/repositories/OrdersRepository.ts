import db from "../../database";
import { Order, OrderItem } from "../entities/Order";
import {
  IOrderRepositoryCreateDTO,
  OrdersRepositoryContract,
} from "./contracts/OrdersRepositoryContract";

class OrdersRepository implements OrdersRepositoryContract {
  async findAllByUserId(user_id: string): Promise<Order[]> {
    const rows = await db.query<Order>(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );
    return rows;
  }

  async create({ items, ...item }: IOrderRepositoryCreateDTO, user_id: string) {
    try {
      await db.query("BEGIN");
      const orderResult = await db.query<Order>(
        `
        INSERT INTO orders 
          (user_id, status, shipping_value, total_value, sub_total_value, address_city, address_country, address_postal_code, address_state, address_street, card_cvv, card_main_card, card_number, card_title, card_valid_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          user_id,
          item.status,
          item.shipping_value,
          item.total_value,
          item.sub_total_value,
          item.address_city,
          item.address_country,
          item.address_postal_code,
          item.address_state,
          item.address_street,
          item.card_cvv,
          item.card_main_card,
          item.card_number,
          item.card_title,
          item.card_valid_date,
        ]
      );
      const order = orderResult[0];
      const orderItemsPromises = items.map((item) => {
        return db.query<OrderItem>(
          `
          INSERT INTO orders_items (order_id, item_id, quantity, price)
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
          [order.id, item.item_id, item.quantity, item.price]
        );
      });
      const orderItemsResults = await Promise.all(orderItemsPromises);
      const orderItems = orderItemsResults.map((result) => result[0]);
      await db.query("COMMIT");
      return {
        ...order,
        items: orderItems,
      };
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error creating order:", error);
    }
  }
}

export default new OrdersRepository();


import db from "../../database";
import { OrderItem } from "../entities/Order";

class OrderItemsRepository {
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const rows = await db.query<OrderItem>(
      `
        SELECT * FROM orders_items, items 
            WHERE order_id = $1 AND items.id = orders_items.item_id
            `,
      [orderId]
    );
    return rows;
  }
}

export default new OrderItemsRepository();


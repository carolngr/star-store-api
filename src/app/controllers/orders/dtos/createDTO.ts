import { OrderItem } from "../../../entities/Order";

export interface ICreateDTO {
  status: "pending" | "completed" | "cancelled";
  card_id?: string;
  address_id?: string;
  shipping_value: number;
  items: Omit<OrderItem, "id" | "order_id">[];
}

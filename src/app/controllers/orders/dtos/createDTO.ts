import { Address } from "../../../entities/Address";
import { Card } from "../../../entities/Card";
import { OrderItem } from "../../../entities/Order";

export interface ICreateDTO {
  status: "pending" | "completed" | "cancelled";
  card: Card;
  address: Address;
  shipping_value: number;
  items: Omit<OrderItem, "id" | "order_id">[];
}

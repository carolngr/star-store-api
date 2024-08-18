import { OrderItem } from "../../entities/Order";

export interface IOrderRepositoryCreateDTO {
  user_id: string;
  status: "pending" | "completed" | "cancelled";
  shipping_value: number;
  total_value: number;
  sub_total_value: number;
  card_title: string;
  card_number: string;
  card_cvv: number;
  card_valid_date: string;
  card_main_card: boolean;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
  items: Omit<OrderItem, "id" | "order_id">[];
}

export interface OrdersRepositoryContract {
  create(
    data: IOrderRepositoryCreateDTO,
    user_id: string
  ): Promise<
    | {
        items: OrderItem[];
        id: string;
        user_id: string;
        status: "pending" | "completed" | "cancelled";
        created_at: Date;
        updated_at: Date;
      }
    | undefined
  >;
}


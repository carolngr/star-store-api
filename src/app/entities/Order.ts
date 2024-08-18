export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
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
  created_at: Date;
  updated_at: Date;
  items: OrderItem[];
}


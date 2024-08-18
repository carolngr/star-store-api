export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  user_id?: string;
  created_at: Date;
  updated_at: Date;
}


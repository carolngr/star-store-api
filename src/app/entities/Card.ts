export interface Card {
  id: string;
  title: string;
  number: string;
  cvv: number;
  main_card: boolean;
  valid_date: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}


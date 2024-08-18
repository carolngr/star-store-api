export interface Item {
  id?: string;
  title: string;
  price: number;
  thumbnail_hd: string;
  seller: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface ItemsRepositoryContract {
  findAll(orderBy?: string): Promise<Item[]>;
  findById(id: string): Promise<Item | null>;
  create(data: Omit<Item, "id" | "created_at" | "updated_at">): Promise<Item>;
  update(
    id: string,
    data: Partial<Omit<Item, "id" | "seller" | "created_at">>
  ): Promise<Item | null>;
  delete(id: string): Promise<void>;
}


import { Product } from './product.interface';

export interface Address {
  street: string;
  city: string;
  region: string;
  zip: string;
  country: string;
  house: string;
}

export interface OrderItem extends Product {
  quantity: number;
  status: Status;
  comment?: string;
  reviewRef?: string;
  orderId?: string;
}

export enum Status {
  pending = 'pending',
  processing = 'processing',
  delivered = 'delivered',
  seen = 'seen',
}

export interface Order {
  products: OrderItem[];
  status: Status;
  total: number;
  userId: string;
  userPhone: string;
  address: Address;
  orderId: string;
  createdAt: string;
  paidAt: string;
}

export interface Notification {
  createdAt: string;
  orderId: string;
  productIds: string[];
  status: Status;
}

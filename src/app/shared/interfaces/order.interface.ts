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
  id: string;
  products: OrderItem[];
  status: Status;
  total: number;
  userId: string;
  userPhone: string;
  address: Address;
  vendorIds?: string[];
  productIds?: string[];
  createdAt: string;
  paidAt: string;
  // Deprecated alias kept until callers migrate; populated when needed.
  orderId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  createdAt: string;
  orderId: string;
  productIds: string[];
  status: Status;
}

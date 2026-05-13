import { Address } from './order.interface';

export enum Type {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  password?: string;
  name?: string;
  type?: Type;
  surname?: string;
  company?: string;
  hvhh?: string;
  image?: string;
  address?: Address;
  isTopSeller?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

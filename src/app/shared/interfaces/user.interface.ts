import { Address } from './order.interface';

export enum Type {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
}

export interface IUser {
  email: string;
  displayName: string;
  phoneNumber: string;
  uid: string;
  password?: string;
  name?: string;
  type?: Type;
  surname?: string;
  company?: string;
  hvhh?: string;
  image?: string;
  address?: Address;
}

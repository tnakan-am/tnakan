import { DeliveryOption } from '../constants/delivery-option.enum';
import { Unit } from '../enums/unit.enum';

export enum Availability {
  unlimited = 'unlimited',
}

export interface Product {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhoto: string | null;
  name: string;
  unit: Unit;
  minQuantity: number;
  price: number;
  image: string;
  description: string;
  avgReview: number;
  category: string;
  subCategory: string;
  availability: number | Availability;
  deliveryOption: DeliveryOption;
  productCategory?: string;
}

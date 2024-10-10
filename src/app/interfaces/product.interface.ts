import { DeliveryOption } from '../constants/delivery-option.enum';

export interface Product {
  userId: string;
  userDisplayName: string;
  userPhoto: string | null;
  name: string;
  unit: string;
  price: number;
  image: string;
  description: string;
  avgReview: number;
  category: string;
  subCategory?: string;
  id?: string;
  productCategory?: string;
  deliveryOption?: DeliveryOption;
}

import { DeliveryOption } from '../constants/delivery-option.enum';
import { Unit } from '../../home/product/common/enums/unit.enum';

export interface Product {
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
  subCategory?: string;
  id?: string;
  productCategory?: string;
  deliveryOption?: DeliveryOption;
}

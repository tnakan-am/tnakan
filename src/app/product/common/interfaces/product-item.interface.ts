import { Unit } from '../../../shared/enums/unit.enum';

export interface ProductItemInterface {
  id: number;
  productName: string;
  shortDescription: string;
  rating: number;
  price: number;
  product_img: string;
  status: string;
  description: string;
  user: string;
  user_photo: string;
  currency: string;
  unit: string;
  unitType: Unit;
}

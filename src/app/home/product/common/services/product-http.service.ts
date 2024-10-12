import { Injectable } from '@angular/core';
import { ProductItemInterface } from '../interfaces/product-item.interface';
import { Observable, of } from 'rxjs';
import { UnitTypeEnum } from '../enums/unit.enum';

@Injectable({ providedIn: 'root' })
export class ProductHttpService {
  products: ProductItemInterface[] = [
    {
      id: 1,
      productName: 'Kololak',
      shortDescription: 'Kololak patrastac tavari msic',
      rating: 3,
      price: 1250,
      product_img:
        'https://www.budgetbytes.com/wp-content/uploads/2022/01/Easy-Homemade-Meatballs-spoon.jpg',
      status: 'in_stock',
      description: 'Kololak patrastac tavari msic, kanachi, sox, hamemunqner',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 2,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 3,
      price: 1250,
      product_img:
        'https://www.budgetbytes.com/wp-content/uploads/2022/01/Easy-Homemade-Meatballs-spoon.jpg',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 3,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 4,
      price: 1250,
      product_img: 'https://alicezaslavsky.com/wp-content/uploads/Tolma_1_1.jpg',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 4,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 3.7,
      price: 1250,
      product_img:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Z5wBzNigYi2JMLJtJ_YKknXrBimLd4kFNg&s',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 5,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 5,
      price: 1250,
      product_img:
        'https://georgianrecipes.com/media/cache/6e/7f/6e7fd5db9837e4dd2a328c2f2111a57a.webp',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 6,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 3,
      price: 1250,
      product_img:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwksCy2emtJx1biFNsEekJ3LG92ZB5cnF4mqB72FTPhrVDbBHCl_Pw8IM0VWAGtI4L-G0&usqp=CAU',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 7,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 3,
      price: 1250,
      product_img:
        'https://static.1000.menu/img/content-v2/d5/f1/66527/tolma-armyanskaya_1658380251_0_max.jpg',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
    {
      id: 8,
      productName: 'Tolma',
      shortDescription: 'lorem ipsum dolor sit amet, consetetur',
      rating: 3,
      price: 1250,
      product_img:
        'https://static.1000.menu/img/content-v2/d5/f1/66527/tolma-armyanskaya_1658380251_0_max.jpg',
      status: 'in_stock',
      description: 'lorem, ipsum dolor sit amet, consetetur lorem ipsum dolor sit amet, consetetur',
      user: 'Marine Petrosyan',
      currency: '֏',
      unit: '1',
      unitType: UnitTypeEnum.kg,
      user_photo:
        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    },
  ];

  getProductList(): Observable<ProductItemInterface[]> {
    return of(this.products);
  }
}

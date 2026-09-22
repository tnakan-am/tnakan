/**
 * Static food-marketplace taxonomy (Category → SubCategory → ProductCategory).
 *
 * Temporary source of truth until categories are managed by admins in the backend.
 * Each name carries all three supported locales; the mandatory `LocalizedText` shape
 * makes it a compile error to add a node without a full translation set.
 * Ids are stable slugs used directly as `?category` / `?subCategory` / `?productCategory`
 * query params, so keep them URL-safe and unique.
 */

export interface LocalizedText {
  hy: string;
  en: string;
  rus: string;
}

export interface RawProductCategory {
  id: string;
  name: LocalizedText;
}

export interface RawSubCategory {
  id: string;
  name: LocalizedText;
  productCategories: RawProductCategory[];
}

export interface RawCategory {
  id: string;
  name: LocalizedText;
  subCategories: RawSubCategory[];
}

export const FOOD_CATEGORIES: RawCategory[] = [
  {
    id: 'meat',
    name: { hy: 'Միս և ձուկ', en: 'Meat & Fish', rus: 'Мясо и рыба' },
    subCategories: [
      {
        id: 'meat-beef',
        name: { hy: 'Տավարի և հորթի միս', en: 'Beef & Veal', rus: 'Говядина и телятина' },
        productCategories: [
          {
            id: 'meat-beef-ground',
            name: { hy: 'Աղացած տավարի միս', en: 'Ground Beef', rus: 'Говяжий фарш' },
          },
          { id: 'meat-beef-steak', name: { hy: 'Սթեյք', en: 'Steak', rus: 'Стейк' } },
          { id: 'meat-beef-ribs', name: { hy: 'Կողիկներ', en: 'Ribs', rus: 'Рёбра' } },
          { id: 'meat-beef-offal', name: { hy: 'Ենթամթերք', en: 'Offal', rus: 'Субпродукты' } },
        ],
      },
      {
        id: 'meat-pork',
        name: { hy: 'Խոզի միս', en: 'Pork', rus: 'Свинина' },
        productCategories: [
          {
            id: 'meat-pork-chops',
            name: { hy: 'Խոզի կտորներ', en: 'Chops', rus: 'Свиные отбивные' },
          },
          {
            id: 'meat-pork-ground',
            name: { hy: 'Աղացած խոզի միս', en: 'Ground Pork', rus: 'Свиной фарш' },
          },
          { id: 'meat-pork-ribs', name: { hy: 'Կողիկներ', en: 'Ribs', rus: 'Рёбрышки' } },
          { id: 'meat-pork-bacon', name: { hy: 'Բեկոն', en: 'Bacon', rus: 'Бекон' } },
        ],
      },
      {
        id: 'meat-chicken',
        name: { hy: 'Հավի միս', en: 'Chicken', rus: 'Курица' },
        productCategories: [
          {
            id: 'meat-chicken-whole',
            name: { hy: 'Ամբողջական հավ', en: 'Whole Chicken', rus: 'Целая курица' },
          },
          {
            id: 'meat-chicken-breast',
            name: { hy: 'Հավի կրծքամիս', en: 'Breast', rus: 'Куриная грудка' },
          },
          {
            id: 'meat-chicken-thighs',
            name: { hy: 'Հավի բարձ', en: 'Thighs', rus: 'Куриные бёдра' },
          },
          {
            id: 'meat-chicken-wings',
            name: { hy: 'Հավի թևիկներ', en: 'Wings', rus: 'Куриные крылья' },
          },
        ],
      },
      {
        id: 'meat-turkey-duck',
        name: { hy: 'Հնդկահավ և բադ', en: 'Turkey & Duck', rus: 'Индейка и утка' },
        productCategories: [
          { id: 'meat-turkey', name: { hy: 'Հնդկահավ', en: 'Turkey', rus: 'Индейка' } },
          { id: 'meat-duck', name: { hy: 'Բադ', en: 'Duck', rus: 'Утка' } },
          { id: 'meat-goose', name: { hy: 'Սագ', en: 'Goose', rus: 'Гусь' } },
        ],
      },
      {
        id: 'meat-lamb',
        name: { hy: 'Գառան և ոչխարի միս', en: 'Lamb & Mutton', rus: 'Баранина' },
        productCategories: [
          { id: 'meat-lamb-lamb', name: { hy: 'Գառան միս', en: 'Lamb', rus: 'Молодая баранина' } },
          { id: 'meat-lamb-mutton', name: { hy: 'Ոչխարի միս', en: 'Mutton', rus: 'Баранина' } },
          { id: 'meat-lamb-offal', name: { hy: 'Ենթամթերք', en: 'Offal', rus: 'Субпродукты' } },
        ],
      },
      {
        id: 'meat-cured',
        name: { hy: 'Երշիկեղեն և ապխտած', en: 'Sausages & Cured', rus: 'Колбасы и деликатесы' },
        productCategories: [
          {
            id: 'meat-cured-sujuk',
            name: { hy: 'Սուջուխ (չորացրած երշիկ)', en: 'Sujuk', rus: 'Суджук' },
          },
          { id: 'meat-cured-basturma', name: { hy: 'Բաստուրմա', en: 'Basturma', rus: 'Бастурма' } },
          { id: 'meat-cured-sausages', name: { hy: 'Երշիկներ', en: 'Sausages', rus: 'Колбаски' } },
          { id: 'meat-cured-ham', name: { hy: 'Խոզապուխտ', en: 'Ham', rus: 'Ветчина' } },
        ],
      },
      {
        id: 'fish-fresh',
        name: { hy: 'Թարմ ձուկ', en: 'Fresh Fish', rus: 'Свежая рыба' },
        productCategories: [
          {
            id: 'fish-fresh-trout',
            name: { hy: 'Իշխան (կարմրախայտ)', en: 'Trout', rus: 'Форель' },
          },
          { id: 'fish-fresh-carp', name: { hy: 'Կարպ', en: 'Carp', rus: 'Карп' } },
          { id: 'fish-fresh-salmon', name: { hy: 'Սաղմոն', en: 'Salmon', rus: 'Лосось' } },
          { id: 'fish-fresh-sig', name: { hy: 'Սիգ', en: 'Whitefish (Sig)', rus: 'Сиг' } },
        ],
      },
      {
        id: 'fish-frozen',
        name: { hy: 'Սառեցված ձուկ', en: 'Frozen Fish', rus: 'Замороженная рыба' },
        productCategories: [
          { id: 'fish-frozen-fillet', name: { hy: 'Ֆիլե', en: 'Fillet', rus: 'Филе' } },
          {
            id: 'fish-frozen-whole',
            name: { hy: 'Ամբողջական սառեցված', en: 'Whole Frozen', rus: 'Целая замороженная' },
          },
        ],
      },
      {
        id: 'fish-smoked',
        name: { hy: 'Ապխտած և աղը դրած', en: 'Smoked & Salted', rus: 'Копчёная и солёная' },
        productCategories: [
          {
            id: 'fish-smoked-smoked',
            name: { hy: 'Ապխտած ձուկ', en: 'Smoked Fish', rus: 'Копчёная рыба' },
          },
          {
            id: 'fish-smoked-salted',
            name: { hy: 'Աղը դրած ձուկ', en: 'Salted Fish', rus: 'Солёная рыба' },
          },
          {
            id: 'fish-smoked-dried',
            name: { hy: 'Չորացրած ձուկ', en: 'Dried Fish', rus: 'Вяленая рыба' },
          },
        ],
      },
      {
        id: 'fish-seafood',
        name: { hy: 'Ծովամթերք', en: 'Seafood', rus: 'Морепродукты' },
        productCategories: [
          {
            id: 'fish-seafood-shrimp',
            name: { hy: 'Ծովախեցգետին (կրեվետ)', en: 'Shrimp', rus: 'Креветки' },
          },
          { id: 'fish-seafood-mussels', name: { hy: 'Միդիաներ', en: 'Mussels', rus: 'Мидии' } },
          { id: 'fish-seafood-squid', name: { hy: 'Կաղամար', en: 'Squid', rus: 'Кальмары' } },
        ],
      },
      {
        id: 'fish-caviar',
        name: { hy: 'Խավիար և ձկան ձու', en: 'Caviar & Roe', rus: 'Икра' },
        productCategories: [
          {
            id: 'fish-caviar-red',
            name: { hy: 'Կարմիր խավիար', en: 'Red Caviar', rus: 'Красная икра' },
          },
          {
            id: 'fish-caviar-black',
            name: { hy: 'Սև խավիար', en: 'Black Caviar', rus: 'Чёрная икра' },
          },
        ],
      },
    ],
  },
  {
    id: 'produce',
    name: { hy: 'Մրգեր և բանջարեղեն', en: 'Fruits & Vegetables', rus: 'Фрукты и овощи' },
    subCategories: [
      {
        id: 'produce-veg',
        name: { hy: 'Թարմ բանջարեղեն', en: 'Fresh Vegetables', rus: 'Свежие овощи' },
        productCategories: [
          { id: 'produce-veg-tomato', name: { hy: 'Լոլիկ', en: 'Tomatoes', rus: 'Помидоры' } },
          { id: 'produce-veg-cucumber', name: { hy: 'Վարունգ', en: 'Cucumbers', rus: 'Огурцы' } },
          { id: 'produce-veg-pepper', name: { hy: 'Պղպեղ', en: 'Peppers', rus: 'Перец' } },
          { id: 'produce-veg-potato', name: { hy: 'Կարտոֆիլ', en: 'Potatoes', rus: 'Картофель' } },
          {
            id: 'produce-veg-onion',
            name: { hy: 'Սոխ և սխտոր', en: 'Onions & Garlic', rus: 'Лук и чеснок' },
          },
          { id: 'produce-veg-eggplant', name: { hy: 'Սմբուկ', en: 'Eggplant', rus: 'Баклажаны' } },
        ],
      },
      {
        id: 'produce-fruit',
        name: { hy: 'Թարմ մրգեր', en: 'Fresh Fruits', rus: 'Свежие фрукты' },
        productCategories: [
          {
            id: 'produce-fruit-apple',
            name: { hy: 'Խնձոր և տանձ', en: 'Apples & Pears', rus: 'Яблоки и груши' },
          },
          { id: 'produce-fruit-grape', name: { hy: 'Խաղող', en: 'Grapes', rus: 'Виноград' } },
          {
            id: 'produce-fruit-apricot',
            name: { hy: 'Ծիրան և դեղձ', en: 'Apricots & Peaches', rus: 'Абрикосы и персики' },
          },
          {
            id: 'produce-fruit-pomegranate',
            name: { hy: 'Նուռ', en: 'Pomegranate', rus: 'Гранат' },
          },
          {
            id: 'produce-fruit-citrus',
            name: { hy: 'Ցիտրուսներ', en: 'Citrus', rus: 'Цитрусовые' },
          },
          {
            id: 'produce-fruit-berries',
            name: { hy: 'Հատապտուղներ', en: 'Berries', rus: 'Ягоды' },
          },
        ],
      },
      {
        id: 'produce-greens',
        name: { hy: 'Կանաչի և համեմունքներ', en: 'Leafy Greens & Herbs', rus: 'Зелень и травы' },
        productCategories: [
          {
            id: 'produce-greens-cilantro',
            name: { hy: 'Համեմ (կինձա)', en: 'Cilantro', rus: 'Кинза' },
          },
          {
            id: 'produce-greens-parsley',
            name: { hy: 'Մաղադանոս', en: 'Parsley', rus: 'Петрушка' },
          },
          { id: 'produce-greens-tarragon', name: { hy: 'Թարխուն', en: 'Tarragon', rus: 'Тархун' } },
          { id: 'produce-greens-basil', name: { hy: 'Ռեհան', en: 'Basil', rus: 'Базилик' } },
          { id: 'produce-greens-dill', name: { hy: 'Սամիթ', en: 'Dill', rus: 'Укроп' } },
        ],
      },
      {
        id: 'produce-mushroom',
        name: { hy: 'Սունկ', en: 'Mushrooms', rus: 'Грибы' },
        productCategories: [
          {
            id: 'produce-mushroom-button',
            name: { hy: 'Շամպինիոն', en: 'Button Mushrooms', rus: 'Шампиньоны' },
          },
          {
            id: 'produce-mushroom-oyster',
            name: { hy: 'Ոստրեասունկ', en: 'Oyster Mushrooms', rus: 'Вёшенки' },
          },
        ],
      },
      {
        id: 'produce-organic',
        name: {
          hy: 'Ֆերմերային և օրգանական',
          en: 'Local Farm & Organic',
          rus: 'Фермерское и органическое',
        },
        productCategories: [],
      },
      {
        id: 'preserves-pickles',
        name: { hy: 'Թթու դրած բանջարեղեն', en: 'Pickled Vegetables', rus: 'Соленья' },
        productCategories: [
          {
            id: 'preserves-pickles-tourshi',
            name: { hy: 'Թթու (թուրշի)', en: 'Tourshi', rus: 'Туршу' },
          },
          {
            id: 'preserves-pickles-cabbage',
            name: { hy: 'Թթու կաղամբ', en: 'Pickled Cabbage', rus: 'Квашеная капуста' },
          },
        ],
      },
      {
        id: 'preserves-jam',
        name: { hy: 'Մուրաբա և ջեմ', en: 'Jams & Fruit Preserves', rus: 'Варенье и джем' },
        productCategories: [
          { id: 'preserves-jam-jam', name: { hy: 'Ջեմ', en: 'Jam', rus: 'Джем' } },
          {
            id: 'preserves-jam-murabba',
            name: { hy: 'Մուրաբա', en: 'Fruit Preserve (Murabba)', rus: 'Варенье' },
          },
        ],
      },
      {
        id: 'preserves-compote',
        name: { hy: 'Կոմպոտ և օշարակ', en: 'Compotes & Syrups', rus: 'Компоты и сиропы' },
        productCategories: [],
      },
      {
        id: 'preserves-dried',
        name: { hy: 'Չիր և պաստեղ', en: 'Sun-Dried & Fruit Leather', rus: 'Сухофрукты и пастила' },
        productCategories: [
          {
            id: 'preserves-dried-lavash',
            name: {
              hy: 'Թթու լավաշ (պաստեղ)',
              en: "Fruit Leather (T'tu Lavash)",
              rus: 'Тту лаваш (пастила)',
            },
          },
          {
            id: 'preserves-dried-sujukh',
            name: { hy: 'Սուջուխ (չուրչխելա)', en: 'Sujukh (Churchkhela)', rus: 'Чурчхела' },
          },
          {
            id: 'preserves-dried-chir',
            name: { hy: 'Չիր', en: 'Dried Fruit (Chir)', rus: 'Сухофрукты' },
          },
        ],
      },
      {
        id: 'preserves-honey',
        name: {
          hy: 'Մեղր և մեղվաբուծական մթերք',
          en: 'Honey & Bee Products',
          rus: 'Мёд и продукты пчеловодства',
        },
        productCategories: [
          { id: 'preserves-honey-honey', name: { hy: 'Մեղր', en: 'Honey', rus: 'Мёд' } },
          { id: 'preserves-honey-pollen', name: { hy: 'Ծաղկափոշի', en: 'Pollen', rus: 'Пыльца' } },
        ],
      },
    ],
  },
  {
    id: 'dairy',
    name: { hy: 'Կաթնամթերք և հաց', en: 'Dairy & Bakery', rus: 'Молочное и выпечка' },
    subCategories: [
      {
        id: 'dairy-cheese',
        name: { hy: 'Պանիր', en: 'Cheese', rus: 'Сыр' },
        productCategories: [
          {
            id: 'dairy-cheese-lori',
            name: { hy: 'Լոռի պանիր', en: 'Lori Cheese', rus: 'Сыр Лори' },
          },
          { id: 'dairy-cheese-chanakh', name: { hy: 'Չանախ', en: 'Chanakh', rus: 'Чанах' } },
          {
            id: 'dairy-cheese-chechil',
            name: { hy: 'Չեչիլ (հյուսած պանիր)', en: 'String Cheese (Chechil)', rus: 'Чечил' },
          },
          { id: 'dairy-cheese-motal', name: { hy: 'Մոթալ', en: 'Motal', rus: 'Мотал' } },
        ],
      },
      {
        id: 'dairy-milk',
        name: { hy: 'Կաթ և թթվասեր մթերք', en: 'Milk & Cultured', rus: 'Молоко и кисломолочное' },
        productCategories: [
          { id: 'dairy-milk-milk', name: { hy: 'Կաթ', en: 'Milk', rus: 'Молоко' } },
          { id: 'dairy-milk-matsun', name: { hy: 'Մածուն', en: 'Matsun (Yogurt)', rus: 'Мацун' } },
          { id: 'dairy-milk-kefir', name: { hy: 'Կեֆիր', en: 'Kefir', rus: 'Кефир' } },
          { id: 'dairy-milk-sourcream', name: { hy: 'Թթվասեր', en: 'Sour Cream', rus: 'Сметана' } },
        ],
      },
      {
        id: 'dairy-butter',
        name: { hy: 'Կարագ և սերուցք', en: 'Butter & Cream', rus: 'Масло и сливки' },
        productCategories: [
          { id: 'dairy-butter-butter', name: { hy: 'Կարագ', en: 'Butter', rus: 'Масло' } },
          { id: 'dairy-butter-cream', name: { hy: 'Սերուցք', en: 'Cream', rus: 'Сливки' } },
        ],
      },
      {
        id: 'dairy-eggs',
        name: { hy: 'Ձու', en: 'Eggs', rus: 'Яйца' },
        productCategories: [],
      },
      {
        id: 'bakery-bread',
        name: { hy: 'Հաց', en: 'Bread', rus: 'Хлеб' },
        productCategories: [
          { id: 'bakery-bread-lavash', name: { hy: 'Լավաշ', en: 'Lavash', rus: 'Лаваш' } },
          {
            id: 'bakery-bread-matnakash',
            name: { hy: 'Մատնաքաշ', en: 'Matnakash', rus: 'Матнакаш' },
          },
          {
            id: 'bakery-bread-sourdough',
            name: { hy: 'Թթխմորով հաց', en: 'Sourdough', rus: 'Хлеб на закваске' },
          },
        ],
      },
      {
        id: 'bakery-sweet',
        name: { hy: 'Քաղցր խմորեղեն', en: 'Sweet Pastry', rus: 'Сладкая выпечка' },
        productCategories: [
          { id: 'bakery-sweet-gata', name: { hy: 'Գաթա', en: 'Gata', rus: 'Гата' } },
          { id: 'bakery-sweet-nazook', name: { hy: 'Նազուկ', en: 'Nazook', rus: 'Назук' } },
          { id: 'bakery-sweet-baklava', name: { hy: 'Փախլավա', en: 'Baklava', rus: 'Пахлава' } },
        ],
      },
      {
        id: 'bakery-cakes',
        name: { hy: 'Տորթեր և աղանդեր', en: 'Cakes & Desserts', rus: 'Торты и десерты' },
        productCategories: [
          { id: 'bakery-cakes-cake', name: { hy: 'Տորթեր', en: 'Cakes', rus: 'Торты' } },
          { id: 'bakery-cakes-pastry', name: { hy: 'Խմորեղեն', en: 'Pastries', rus: 'Пирожные' } },
        ],
      },
      {
        id: 'bakery-savory',
        name: { hy: 'Աղի խմորեղեն', en: 'Savory Pastry', rus: 'Несладкая выпечка' },
        productCategories: [
          {
            id: 'bakery-savory-khachapuri',
            name: { hy: 'Խաչապուրի', en: 'Khachapuri', rus: 'Хачапури' },
          },
          { id: 'bakery-savory-byorek', name: { hy: 'Բյորակ', en: 'Byorek', rus: 'Бёрек' } },
          { id: 'bakery-savory-piroshki', name: { hy: 'Պիրոժկի', en: 'Piroshki', rus: 'Пирожки' } },
        ],
      },
    ],
  },
  {
    id: 'pantry',
    name: { hy: 'Մթերք և ըմպելիք', en: 'Pantry & Drinks', rus: 'Бакалея и напитки' },
    subCategories: [
      {
        id: 'pantry-grains',
        name: {
          hy: 'Ձավարեղեն, բրինձ և մակարոն',
          en: 'Grains, Rice & Pasta',
          rus: 'Крупы, рис и макароны',
        },
        productCategories: [
          {
            id: 'pantry-grains-bulgur',
            name: { hy: 'Ձավար (բլղուր)', en: 'Bulgur', rus: 'Булгур' },
          },
          { id: 'pantry-grains-rice', name: { hy: 'Բրինձ', en: 'Rice', rus: 'Рис' } },
          {
            id: 'pantry-grains-buckwheat',
            name: { hy: 'Հնդկաձավար', en: 'Buckwheat', rus: 'Гречка' },
          },
          { id: 'pantry-grains-pasta', name: { hy: 'Մակարոնեղեն', en: 'Pasta', rus: 'Макароны' } },
        ],
      },
      {
        id: 'pantry-legumes',
        name: { hy: 'Ընդեղեն', en: 'Legumes & Beans', rus: 'Бобовые' },
        productCategories: [
          { id: 'pantry-legumes-lentils', name: { hy: 'Ոսպ', en: 'Lentils', rus: 'Чечевица' } },
          { id: 'pantry-legumes-beans', name: { hy: 'Լոբի', en: 'Beans', rus: 'Фасоль' } },
          { id: 'pantry-legumes-chickpeas', name: { hy: 'Սիսեռ', en: 'Chickpeas', rus: 'Нут' } },
        ],
      },
      {
        id: 'pantry-oils',
        name: {
          hy: 'Յուղեր, քացախ և սոուսներ',
          en: 'Oils, Vinegars & Sauces',
          rus: 'Масла, уксус и соусы',
        },
        productCategories: [
          {
            id: 'pantry-oils-sunflower',
            name: { hy: 'Արևածաղկի յուղ', en: 'Sunflower Oil', rus: 'Подсолнечное масло' },
          },
          {
            id: 'pantry-oils-olive',
            name: { hy: 'Ձիթապտղի յուղ', en: 'Olive Oil', rus: 'Оливковое масло' },
          },
          { id: 'pantry-oils-vinegar', name: { hy: 'Քացախ', en: 'Vinegar', rus: 'Уксус' } },
          { id: 'pantry-oils-sauces', name: { hy: 'Սոուսներ', en: 'Sauces', rus: 'Соусы' } },
        ],
      },
      {
        id: 'pantry-spices',
        name: { hy: 'Համեմունքներ', en: 'Spices & Seasonings', rus: 'Специи и приправы' },
        productCategories: [
          {
            id: 'pantry-spices-herbs',
            name: { hy: 'Չորացրած կանաչի', en: 'Dried Herbs', rus: 'Сушёная зелень' },
          },
          {
            id: 'pantry-spices-blends',
            name: { hy: 'Համեմունքների խառնուրդ', en: 'Spice Blends', rus: 'Смеси специй' },
          },
        ],
      },
      {
        id: 'pantry-canned',
        name: { hy: 'Պահածոներ', en: 'Canned & Jarred', rus: 'Консервы' },
        productCategories: [],
      },
      {
        id: 'pantry-flour',
        name: { hy: 'Ալյուր և հացաթխման', en: 'Flour & Baking', rus: 'Мука и выпечка' },
        productCategories: [
          { id: 'pantry-flour-flour', name: { hy: 'Ալյուր', en: 'Flour', rus: 'Мука' } },
          { id: 'pantry-flour-sugar', name: { hy: 'Շաքարավազ', en: 'Sugar', rus: 'Сахар' } },
          { id: 'pantry-flour-yeast', name: { hy: 'Խմորիչ', en: 'Yeast', rus: 'Дрожжи' } },
        ],
      },
      {
        id: 'sweets-nuts',
        name: { hy: 'Չիր և ընկուզեղեն', en: 'Dried Fruits & Nuts', rus: 'Сухофрукты и орехи' },
        productCategories: [
          {
            id: 'sweets-nuts-walnut',
            name: { hy: 'Ընկույզ', en: 'Walnuts', rus: 'Грецкие орехи' },
          },
          { id: 'sweets-nuts-almond', name: { hy: 'Նուշ', en: 'Almonds', rus: 'Миндаль' } },
          {
            id: 'sweets-nuts-apricot',
            name: { hy: 'Չիր (ծիրանի)', en: 'Dried Apricot', rus: 'Курага' },
          },
          { id: 'sweets-nuts-raisins', name: { hy: 'Չամիչ', en: 'Raisins', rus: 'Изюм' } },
        ],
      },
      {
        id: 'sweets-chocolate',
        name: { hy: 'Շոկոլադ և կոնֆետ', en: 'Chocolate & Candy', rus: 'Шоколад и конфеты' },
        productCategories: [
          {
            id: 'sweets-chocolate-chocolate',
            name: { hy: 'Շոկոլադ', en: 'Chocolate', rus: 'Шоколад' },
          },
          { id: 'sweets-chocolate-candy', name: { hy: 'Կոնֆետ', en: 'Candy', rus: 'Конфеты' } },
        ],
      },
      {
        id: 'sweets-traditional',
        name: {
          hy: 'Ավանդական քաղցրավենիք',
          en: 'Traditional Sweets',
          rus: 'Традиционные сладости',
        },
        productCategories: [
          {
            id: 'sweets-traditional-sujukh',
            name: { hy: 'Սուջուխ (չուրչխելա)', en: 'Sujukh (Churchkhela)', rus: 'Чурчхела' },
          },
          { id: 'sweets-traditional-halva', name: { hy: 'Հալվա', en: 'Halva', rus: 'Халва' } },
          { id: 'sweets-traditional-alani', name: { hy: 'Ալանի', en: 'Alani', rus: 'Аляни' } },
        ],
      },
      {
        id: 'beverages-water',
        name: {
          hy: 'Ջուր և զովացուցիչ ըմպելիքներ',
          en: 'Water & Soft Drinks',
          rus: 'Вода и безалкогольные напитки',
        },
        productCategories: [
          { id: 'beverages-water-water', name: { hy: 'Ջուր', en: 'Water', rus: 'Вода' } },
          {
            id: 'beverages-water-mineral',
            name: { hy: 'Հանքային ջուր', en: 'Mineral Water', rus: 'Минеральная вода' },
          },
          {
            id: 'beverages-water-soda',
            name: { hy: 'Գազավորված ըմպելիքներ', en: 'Soft Drinks', rus: 'Газированные напитки' },
          },
        ],
      },
      {
        id: 'beverages-juice',
        name: { hy: 'Հյութեր և կոմպոտ', en: 'Juices & Compotes', rus: 'Соки и компоты' },
        productCategories: [
          { id: 'beverages-juice-juice', name: { hy: 'Հյութ', en: 'Juice', rus: 'Сок' } },
          { id: 'beverages-juice-compote', name: { hy: 'Կոմպոտ', en: 'Compote', rus: 'Компот' } },
        ],
      },
      {
        id: 'beverages-coffee',
        name: { hy: 'Սուրճ և թեյ', en: 'Coffee & Tea', rus: 'Кофе и чай' },
        productCategories: [
          { id: 'beverages-coffee-coffee', name: { hy: 'Սուրճ', en: 'Coffee', rus: 'Кофе' } },
          { id: 'beverages-coffee-tea', name: { hy: 'Թեյ', en: 'Tea', rus: 'Чай' } },
          {
            id: 'beverages-coffee-herbal',
            name: { hy: 'Դեղաբույսերի թեյ', en: 'Herbal Tea', rus: 'Травяной чай' },
          },
        ],
      },
      {
        id: 'beverages-alcohol',
        name: { hy: 'Գինի և ոգելից խմիչքներ', en: 'Wine & Spirits', rus: 'Вино и крепкие напитки' },
        productCategories: [
          { id: 'beverages-alcohol-wine', name: { hy: 'Գինի', en: 'Wine', rus: 'Вино' } },
          { id: 'beverages-alcohol-brandy', name: { hy: 'Կոնյակ', en: 'Brandy', rus: 'Коньяк' } },
          { id: 'beverages-alcohol-vodka', name: { hy: 'Օղի', en: 'Vodka', rus: 'Водка' } },
        ],
      },
    ],
  },
  {
    id: 'prepared',
    name: { hy: 'Պատրաստի ուտեստ', en: 'Prepared Food', rus: 'Готовые блюда' },
    subCategories: [
      {
        id: 'prepared-traditional',
        name: { hy: 'Ավանդական ուտեստներ', en: 'Traditional Dishes', rus: 'Традиционные блюда' },
        productCategories: [
          {
            id: 'prepared-traditional-dolma',
            name: { hy: 'Տոլմա (դոլմա)', en: 'Dolma', rus: 'Долма' },
          },
          { id: 'prepared-traditional-khash', name: { hy: 'Խաշ', en: 'Khash', rus: 'Хаш' } },
          {
            id: 'prepared-traditional-harissa',
            name: { hy: 'Հարիսա', en: 'Harissa', rus: 'Хариса' },
          },
          {
            id: 'prepared-traditional-spas',
            name: { hy: 'Սպաս (թանապուր)', en: 'Spas', rus: 'Спас' },
          },
          {
            id: 'prepared-traditional-ghapama',
            name: { hy: 'Ղափամա', en: 'Ghapama', rus: 'Гапама' },
          },
        ],
      },
      {
        id: 'prepared-semi',
        name: { hy: 'Կիսաֆաբրիկատներ', en: 'Semi-Finished / Ready-to-Cook', rus: 'Полуфабрикаты' },
        productCategories: [
          {
            id: 'prepared-semi-dumplings',
            name: {
              hy: 'Խինկալի և պելմենի',
              en: 'Dumplings (Khinkali & Pelmeni)',
              rus: 'Хинкали и пельмени',
            },
          },
          {
            id: 'prepared-semi-ishli',
            name: { hy: 'Իշլի քյուֆթա', en: 'Ishli Kufta', rus: 'Ишли кюфта' },
          },
          { id: 'prepared-semi-cutlets', name: { hy: 'Կոտլետներ', en: 'Cutlets', rus: 'Котлеты' } },
          {
            id: 'prepared-semi-stuffed',
            name: { hy: 'Լցոնած պղպեղ', en: 'Stuffed Peppers', rus: 'Фаршированный перец' },
          },
          {
            id: 'prepared-semi-lahmacun',
            name: { hy: 'Լահմաջո', en: 'Lahmacun', rus: 'Лахмаджо' },
          },
        ],
      },
      {
        id: 'prepared-salads',
        name: { hy: 'Աղցաններ և մեզե', en: 'Salads & Mezze', rus: 'Салаты и закуски' },
        productCategories: [
          {
            id: 'prepared-salads-eggplant',
            name: { hy: 'Սմբուկի աղցան', en: 'Eggplant Salad', rus: 'Салат из баклажанов' },
          },
          {
            id: 'prepared-salads-ajapsandal',
            name: { hy: 'Աջափսանդալ', en: 'Ajapsandal', rus: 'Аджапсандал' },
          },
          {
            id: 'prepared-salads-pickles',
            name: { hy: 'Թթու պատրաստի', en: 'Pickled Plate', rus: 'Соленья-ассорти' },
          },
        ],
      },
      {
        id: 'prepared-soups',
        name: { hy: 'Ապուրներ և շոգեխաշած', en: 'Soups & Stews', rus: 'Супы и рагу' },
        productCategories: [
          { id: 'prepared-soups-soup', name: { hy: 'Ապուրներ', en: 'Soups', rus: 'Супы' } },
          {
            id: 'prepared-soups-stew',
            name: { hy: 'Շոգեխաշած ուտեստներ', en: 'Stews', rus: 'Тушёные блюда' },
          },
        ],
      },
      {
        id: 'prepared-grill',
        name: { hy: 'Խորովածի պատրաստի', en: 'Grill / Khorovats-Ready', rus: 'Маринады для гриля' },
        productCategories: [
          {
            id: 'prepared-grill-pork',
            name: { hy: 'Մարինացված խոզի միս', en: 'Marinated Pork', rus: 'Маринованная свинина' },
          },
          {
            id: 'prepared-grill-chicken',
            name: { hy: 'Մարինացված հավ', en: 'Marinated Chicken', rus: 'Маринованная курица' },
          },
          {
            id: 'prepared-grill-lula',
            name: { hy: 'Լյուլա քյաբաբ', en: 'Lula Kebab', rus: 'Люля-кебаб' },
          },
        ],
      },
    ],
  },
];

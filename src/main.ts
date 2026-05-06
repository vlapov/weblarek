import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Проверка модели каталога: сохранение списка, получение товара и preview.
const catalogModel = new CatalogModel();

catalogModel.setItems(apiProducts.items);
console.log('Catalog: массив товаров после setItems ->', catalogModel.getItems());

const firstId = apiProducts.items[0].id;
const firstCatalogProduct = catalogModel.getProduct(firstId);
console.log('Catalog: товар с id ->', firstId, '->', firstCatalogProduct);

const firstPreviewProduct = apiProducts.items[0];
catalogModel.setPreview(firstPreviewProduct);
console.log('Catalog: preview после setPreview(product) ->', catalogModel.getPreview());

const cartModel = new CartModel();

// Тестовые товары для проверки операций корзины.
const firstCartProduct = apiProducts.items[0];
const secondCartProduct = apiProducts.items[1];
const thirdCartProduct = apiProducts.items[2];

cartModel.add(firstCartProduct);
cartModel.add(secondCartProduct);
cartModel.add(thirdCartProduct);
console.log('Cart: товары после добавления ->', cartModel.getItems());

cartModel.remove(secondCartProduct);
console.log('Cart: товары после удаления ->', cartModel.getItems());

console.log(
  'Cart: hasProduct ->', firstCartProduct.id, '->', cartModel.hasProduct(firstCartProduct.id)
);
console.log(
  'Cart: hasProduct ->', secondCartProduct.id, '->', cartModel.hasProduct(secondCartProduct.id)
);
console.log(
  'Cart: hasProduct ->', thirdCartProduct.id, '->', cartModel.hasProduct(thirdCartProduct.id)
);

console.log('Cart: count  ->', cartModel.getCount());
console.log('Cart: total  ->', cartModel.getTotal());

// После очистки и количество, и сумма должны стать нулевыми.
cartModel.clear();

console.log('Cart after clear: count ->', cartModel.getCount());
console.log('Cart after clear: total ->', cartModel.getTotal());

const buyerModel = new BuyerModel();

// Проверка поэтапного заполнения покупателя и валидации.
console.log('Buyer: initial getData ->', buyerModel.getData());
console.log('Buyer: initial validate ->', buyerModel.validate());

buyerModel.setData({ address: 'Москва, ул. Пушкина, д. Колотушкина, 1' });
console.log('Buyer: after setData({ address }) ->', buyerModel.getData());
console.log('Buyer: validate after address only ->', buyerModel.validate());

buyerModel.setData({
  email: 'test@example.com',
  phone: '+79990001122',
});
console.log('Buyer: after setData({ email, phone }) ->', buyerModel.getData());
console.log('Buyer: validate after email+phone ->', buyerModel.validate());

buyerModel.setData({ payment: 'online' });
console.log('Buyer: after setData({ payment: "online" }) ->', buyerModel.getData());
console.log('Buyer: validate after full data ->', buyerModel.validate());

buyerModel.clear();
console.log('Buyer: after clear getData ->', buyerModel.getData());
console.log('Buyer: after clear validate ->', buyerModel.validate());

// Подключение коммуникационного слоя и получение каталога с сервера.
const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProductList()
  .then((data) => {
    catalogModel.setItems(data.items);
    console.log('Catalog from server:', catalogModel.getItems());
  })
  .catch((err) => {
    console.error('GET /product/ error:', err);
  });
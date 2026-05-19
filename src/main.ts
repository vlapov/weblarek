import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { OrderSuccess } from './components/views/OrderSuccess';
import { Modal } from './components/views/Modal';
import { IBuyerValidationErrors, IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

const formatPrice = (price: IProduct['price']): string =>
  price === null ? 'Бесценно' : `${price} синапсов`;

const formatTotal = (total: number): string => `${total} синапсов`;

const joinErrors = (...messages: (string | undefined)[]) =>
  messages.filter(Boolean).join(' ');

// --- Инициализация ---
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const order = new Order(events, cloneTemplate<HTMLFormElement>(orderTemplate));
const contacts = new Contacts(events, cloneTemplate<HTMLFormElement>(contactsTemplate));
const orderSuccess = new OrderSuccess(events, cloneTemplate<HTMLElement>(successTemplate));
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>(cardPreviewTemplate),
  () => {
    const id = catalogModel.getPreview()?.id;
    if (id) events.emit('card:select', { id });
  },
  () => events.emit('preview:action')
);
const basket = new Basket(events, cloneTemplate<HTMLElement>(basketTemplate));

const closeModal = () => {
  modal.render({ isOpen: false });
};

// --- Презентер: подготовка данных для View ---
const getOrderFormState = () => {
  const errors: IBuyerValidationErrors = buyerModel.validate();

  return {
    payment: buyerModel.getData().payment,
    address: buyerModel.getData().address,
    errors: joinErrors(errors.payment, errors.address),
    valid: !errors.payment && !errors.address,
  };
};

const getContactsFormState = (apiError?: string) => {
  const errors: IBuyerValidationErrors = buyerModel.validate();

  return {
    email: buyerModel.getData().email,
    phone: buyerModel.getData().phone,
    errors: apiError ?? joinErrors(errors.email, errors.phone),
    valid: !errors.email && !errors.phone,
  };
};

const renderCatalog = () => {
  const catalogCards = catalogModel.getItems().map((item) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLButtonElement>(cardCatalogTemplate),
      () => events.emit('card:select', { id: item.id })
    );

    return card.render({
      title: item.title,
      category: item.category,
      image: { src: `${CDN_URL}${item.image}`, alt: item.title },
      price: formatPrice(item.price),
    });
  });

  gallery.render({ catalog: catalogCards });
};

const renderHeader = () => {
  header.render({ counter: cartModel.getCount() });
};

const getPreviewButtonState = (product: IProduct): {
  buttonText: string;
  buttonDisabled: boolean;
} => {
  if (product.price === null) {
    return { buttonText: 'Недоступно', buttonDisabled: true };
  }

  if (cartModel.hasProduct(product.id)) {
    return { buttonText: 'Удалить из корзины', buttonDisabled: false };
  }

  return { buttonText: 'Купить', buttonDisabled: false };
};

const openPreview = () => {
  const product = catalogModel.getPreview();
  if (!product) return;

  const buttonState = getPreviewButtonState(product);

  modal.render({
    content: cardPreview.render({
      title: product.title,
      category: product.category,
      description: product.description,
      image: { src: `${CDN_URL}${product.image}`, alt: product.title },
      price: formatPrice(product.price),
      ...buttonState,
    }),
    isOpen: true,
  });
};

const renderBasket = () => {
  const items = cartModel.getItems();
  const basketItems = items.map((product, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLLIElement>(cardBasketTemplate),
      () => events.emit('card:remove', { id: product.id })
    );

    return card.render({
      title: product.title,
      price: formatPrice(product.price),
      index: index + 1,
    });
  });

  basket.render({
    items: basketItems,
    total: formatTotal(cartModel.getTotal()),
    orderEnabled: items.length > 0,
  });
};

const openBasket = () => {
  modal.render({ content: basket.render(), isOpen: true });
};

const openOrder = () => {
  modal.render({ content: order.render(getOrderFormState()), isOpen: true });
};

const openContacts = () => {
  modal.render({ content: contacts.render(getContactsFormState()), isOpen: true });
};

const openOrderSuccess = (total: number) => {
  modal.render({
    content: orderSuccess.render({
      total: `Списано ${total} синапсов`,
    }),
    isOpen: true,
  });
};

const renderBuyerForms = () => {
  order.render(getOrderFormState());
  contacts.render(getContactsFormState());
};

// --- Загрузка каталога с сервера ---
webLarekApi.getProductList()
  .then((data) => {
    catalogModel.setItems(data.items);
  })
  .catch((err) => {
    console.error('GET /product/ error:', err);
  });

// --- Презентер: события моделей ---
events.on('items:changed', () => {
  renderCatalog();
});

events.on('preview:changed', () => {
  openPreview();
});

events.on('cart:changed', () => {
  renderHeader();
  renderBasket();
});

events.on('buyer:changed', renderBuyerForms);

// --- Презентер: события представлений ---
events.on('card:select', (data: { id: string }) => {
  const product = catalogModel.getProduct(data.id);
  if (product) {
    catalogModel.setPreview(product);
  }
});

events.on('preview:action', () => {
  const product = catalogModel.getPreview();
  if (!product || product.price === null) return;

  if (cartModel.hasProduct(product.id)) {
    cartModel.remove(product);
  } else {
    cartModel.add(product);
  }

  closeModal();
});

events.on('card:remove', (data: { id: string }) => {
  const product = catalogModel.getProduct(data.id);
  if (product) {
    cartModel.remove(product);
  }
});

events.on('basket:open', () => {
  openBasket();
});

events.on('basket:order', () => {
  openOrder();
});

events.on('order:payment', (data: { payment: 'online' | 'offline' }) => {
  buyerModel.setData({ payment: data.payment });
});

events.on('order:address', (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

events.on('order:submit', () => {
  openContacts();
});

events.on('contacts:change', (data: { email?: string; phone?: string }) => {
  buyerModel.setData(data);
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();

  webLarekApi.createOrder({
    ...buyer,
    items: cartModel.getItems().map((item) => item.id),
    total: cartModel.getTotal(),
  })
    .then((response) => {
      cartModel.clear();
      buyerModel.clear();
      openOrderSuccess(response.total);
    })
    .catch((err: unknown) => {
      const message = typeof err === 'string' ? err : 'Не удалось оформить заказ';
      contacts.render(getContactsFormState(message));
    });
});

events.on('order:success-close', () => {
  closeModal();
});

events.on('modal:close', () => {
  closeModal();
});

renderHeader();
renderBasket();

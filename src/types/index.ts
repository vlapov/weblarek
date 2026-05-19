export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'offline' | '';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type IBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IApiErrorResponse {
    error: string;
}

/** Изображение карточки: URL и альтернативный текст (готовит презентер из модели). */
export type ICardImage = {
    src: string;
    alt: string;
};

/** Данные для отображения карточки (строки для UI готовит презентер). Идентификатор — в колбэке конструктора View, не в полях и не в `render()`. */
export type ICardDisplay = Pick<IProduct, 'title' | 'category'> & {
    image: ICardImage;
    price: string;
};

/** Дополнительные поля карточки каталога (к `ICard` из `Card`). */
export type ICardCatalog = Pick<ICardDisplay, 'category' | 'image'>;

/** Данные модалки с подробной карточкой товара. */
export type ICardPreviewDisplay = ICardDisplay &
    Pick<IProduct, 'description'> & {
        buttonText: string;
        buttonDisabled: boolean;
    };

/** Дополнительные поля превью (к `ICard`; категория и изображение — через `ICardCatalog` в дженерике `Card`). */
export type ICardPreview = Omit<ICardPreviewDisplay, keyof ICardDisplay>;

/** Данные строки товара в корзине. */
export type ICardBasketDisplay = Pick<ICardDisplay, 'title' | 'price'> & {
    index: number;
};

/** Дополнительные поля строки корзины (к `ICard` из `Card`). */
export type ICardBasket = Pick<ICardBasketDisplay, 'index'>;

/** Общие поля форм для отображения валидации. */
export type IFormDisplay = {
    errors: string;
    valid: boolean;
};

/** Данные формы первого шага оформления. */
export type IOrderFormDisplay = IFormDisplay &
    Pick<IBuyer, 'payment' | 'address'>;

/** Данные формы второго шага оформления. */
export type IContactsFormDisplay = IFormDisplay &
    Pick<IBuyer, 'email' | 'phone'>;

/** Данные экрана успешного оформления заказа. */
export type IOrderSuccessDisplay = {
    total: string;
};

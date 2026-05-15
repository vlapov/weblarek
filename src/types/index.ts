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

/** Данные для отображения карточки товара (строки для UI готовит презентер). */
export type ICardDisplay = Pick<IProduct, 'id' | 'title' | 'category'> & {
    image: string;
    price: string;
};

export type TCardPreviewAction = 'buy' | 'remove' | 'none';

/** Данные модалки с подробной карточкой товара. */
export type ICardPreviewDisplay = ICardDisplay &
    Pick<IProduct, 'description'> & {
        buttonText: string;
        buttonDisabled: boolean;
        buttonAction: TCardPreviewAction;
    };

/** Данные строки товара в корзине. */
export type ICardBasketDisplay = Pick<ICardDisplay, 'id' | 'title' | 'price'> & {
    index: number;
};

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

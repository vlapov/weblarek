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

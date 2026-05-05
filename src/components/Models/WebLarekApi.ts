import { IApi, IOrderRequest, IOrderResponse, IProductListResponse } from '../../types';

export class WebLarekApi {
    constructor(protected api: IApi) {}

    getProductList(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}

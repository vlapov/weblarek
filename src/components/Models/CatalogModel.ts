import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed', { items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
        this.events.emit('preview:changed', { product });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}

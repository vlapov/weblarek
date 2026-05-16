import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICard {
    title: string;
    price: string;
}

export abstract class Card<T extends object = object> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }
}

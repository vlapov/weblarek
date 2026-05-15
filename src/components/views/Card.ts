import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export abstract class Card<T extends object> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }
}

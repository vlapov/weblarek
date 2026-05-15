import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBasket {
    items: HTMLElement[];
    total: string;
    orderEnabled: boolean;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.orderButton.addEventListener('click', () => {
            if (!this.orderButton.disabled) {
                this.events.emit('basket:order');
            }
        });
    }

    set items(nodes: HTMLElement[]) {
        this.listElement.replaceChildren(...nodes);
    }

    set total(value: string) {
        this.totalElement.textContent = value;
    }

    set orderEnabled(value: boolean) {
        this.orderButton.disabled = !value;
    }
}

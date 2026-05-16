import { ICardBasket } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected productId: string
    ) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.events.emit('card:remove', { id: this.productId });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}

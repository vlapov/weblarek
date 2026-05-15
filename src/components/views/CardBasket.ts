import { ICardBasketDisplay } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardBasket extends Card<ICardBasketDisplay> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('card:remove', { id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}

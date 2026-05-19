import { ICardBasket } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            onRemove();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}

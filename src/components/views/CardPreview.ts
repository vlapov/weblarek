import { ICardCatalog, ICardPreview, TCardPreviewAction } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CardCatalog } from './CardCatalog';

export class CardPreview extends CardCatalog<ICardCatalog & ICardPreview> {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected action: TCardPreviewAction = 'none';

    constructor(container: HTMLElement, events: IEvents, productId: string) {
        super(container, events, productId);

        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', (event) => {
            event.stopPropagation();

            if (this.action === 'buy') {
                this.events.emit('card:buy', { id: this.productId });
            }

            if (this.action === 'remove') {
                this.events.emit('card:remove', { id: this.productId });
            }
        });
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set buttonAction(value: TCardPreviewAction) {
        this.action = value;
    }
}

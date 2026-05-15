import { ICardPreviewDisplay, TCardPreviewAction } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CardCatalog } from './CardCatalog';

export class CardPreview extends CardCatalog<ICardPreviewDisplay> {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected action: TCardPreviewAction = 'none';

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', (event) => {
            event.stopPropagation();
            if (this.buttonElement.disabled) return;

            const id = this.container.dataset.id;
            if (!id) return;

            if (this.action === 'buy') {
                this.events.emit('card:buy', { id });
            }

            if (this.action === 'remove') {
                this.events.emit('card:remove', { id });
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

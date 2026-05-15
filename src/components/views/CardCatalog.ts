import { categoryMap } from '../../utils/constants';
import { ICardDisplay } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardCatalog<T extends ICardDisplay = ICardDisplay> extends Card<T> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('card:select', { id });
            }
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });

        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: string) {
        const alt = this.titleElement.textContent ?? '';
        this.setImage(this.imageElement, value, alt);
    }
}

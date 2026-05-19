import { categoryMap } from '../../utils/constants';
import { ICardCatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export class CardCatalog<T extends ICardCatalog = ICardCatalog> extends Card<T> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onSelect: () => void) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', onSelect);
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

    set image(value: { src: string; alt: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
    }
}

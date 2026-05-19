import { categoryMap } from '../../utils/constants';
import { ICardCatalog, ICardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export class CardPreview extends Card<ICardCatalog & ICardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onSelect: () => void,
        onAction: () => void
    ) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.container.addEventListener('click', onSelect);

        this.buttonElement.addEventListener('click', (event) => {
            event.stopPropagation();
            onAction();
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

    set image(value: { src: string; alt: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
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
}

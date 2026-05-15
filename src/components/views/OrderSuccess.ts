import { IOrderSuccessDisplay } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class OrderSuccess extends Component<IOrderSuccessDisplay> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            '.order-success__description',
            container
        );
        this.closeButton = ensureElement<HTMLButtonElement>(
            '.order-success__close',
            container
        );

        this.closeButton.addEventListener('click', () => {
            this.events.emit('order:success-close');
        });
    }

    set total(value: string) {
        this.descriptionElement.textContent = value;
    }
}

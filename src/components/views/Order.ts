import { IOrderFormDisplay, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class Order extends Form<IOrderFormDisplay> {
    protected paymentCardButton: HTMLButtonElement;
    protected paymentCashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);

        this.paymentCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.paymentCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentCardButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'online' });
        });

        this.paymentCashButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'offline' });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address', { address: this.addressInput.value });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set payment(value: TPayment) {
        this.paymentCardButton.classList.remove('button_alt-active');
        this.paymentCashButton.classList.remove('button_alt-active');

        if (value === 'online') {
            this.paymentCardButton.classList.add('button_alt-active');
        }

        if (value === 'offline') {
            this.paymentCashButton.classList.add('button_alt-active');
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}

import { IContactsFormDisplay } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class Contacts extends Form<IContactsFormDisplay> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { phone: this.phoneInput.value });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}

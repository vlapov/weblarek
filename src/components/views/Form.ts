import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IFormDisplay } from '../../types';

export abstract class Form<T extends IFormDisplay> extends Component<T> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}

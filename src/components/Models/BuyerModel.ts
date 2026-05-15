import { IBuyer, IBuyerValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    protected buyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    };

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        this.buyer = {
            ...this.buyer,
            ...data,
        };
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    getData(): IBuyer {
        return this.buyer;
    }

    clear(): void {
        this.buyer = {
            payment: '',
            email: '',
            phone: '',
            address: '',
        };
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    validate(): IBuyerValidationErrors {
        const errors: IBuyerValidationErrors = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.buyer.email) {
            errors.email = 'Укажите емэйл';
        }

        if (!this.buyer.phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this.buyer.address) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }
}

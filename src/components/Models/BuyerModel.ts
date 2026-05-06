import { IBuyer, IBuyerValidationErrors } from '../../types';

export class BuyerModel {
    protected buyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    }

    setData(data: Partial<IBuyer>): void {
        this.buyer = {
            ...this.buyer,
            ...data,
        }
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
        }
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
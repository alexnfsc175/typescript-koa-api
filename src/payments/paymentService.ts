import { IPaymentStrategy } from './ipaymentstrategy';
export class PaymentService {

    strategy: IPaymentStrategy;

    constructor(strategy: IPaymentStrategy) {
        this.strategy = strategy;
    }

    pay(){
        this.strategy.pay();
    }
}
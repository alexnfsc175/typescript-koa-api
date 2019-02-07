import { IPaymentStrategy } from './ipaymentstrategy';
export class PayPalStrategy  implements IPaymentStrategy{
    
    constructor(parameters) {
        
    }

    pay() {
        throw new Error("Method not implemented.");
    }
}
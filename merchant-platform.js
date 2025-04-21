import crypto from 'crypto';

// merchant related classes

const MerchantStatus = {
    ACTIVE: 'Active',
    DEACTIVATED: 'Deactive',
};

const BusinessType = {
    INVIDUAL: 'INDIVIDUAL',
    PRIVATE_LIMITED: 'PRIVATE_LIMITED',
    LLP: 'LLP'
}

class Merchant {
    constructor(merchantName, email, phoneNumber, businessType, callbackUrl) {
        this.merchantID = crypto.randomUUID(); //to generate unique ids for merchants
        this.name = merchantName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.businessType = businessType;
        this.callbackUrl = callbackUrl; //for validating payment related callbacks
        this.createdAt = new Date();
        this.status = MerchantStatus.ACTIVE; //default case
    }

    deactivate () {
        this.status = MerchantStatus.DEACTIVATED;
    }

    updateCallbackUrl (callbackUrl) {
        this.callbackUrl = callbackUrl;
    }
}

class MerchantService {
    constructor() {
        this.merchants = new Map(); //to store merchant in key value pair 
    }

    registerMerchant(name, email, phoneNumber, businessType, callbackUrl) {
        const merchant = new Merchant(name, email, phoneNumber, businessType, callbackUrl);
        this.merchants.set(merchant.merchantID, merchant);
        return merchant;
    }

    getMerchantById(merchantId) {
        return this.merchants.get(merchantId);
    }

    isMerchantVerified(merchantId) {
        return this.merchants.has(merchantId)
    }

    deactivateMerchant(merchantId) {
        let merchchant = this.merchants.get(merchantId);
        if(merchchant) {
            merchchant.deactivate();
        }
    }
}


//payment related classes and objects

const PaymentStatus = {
    'SUCCESS': 'SUCCESS',
    'PENDING': 'PENDING',
    'FAILED': 'FAILED'
}

const CURRENCIES = {
    'INR': 'INR',
    'USD': 'USD',
    'CAD': 'CAD',
    'JYP': 'JYP'
}

class PaymentOrder {
    constructor(merchantID, amount, currency) {
        
        if (!Object.values(CURRENCIES).includes(currency)) {
            throw new Error(`Invalid currency: ${currency}`);
        }
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        this.orderID = crypto.randomUUID(); //unique id for each payment order
        this.merchantID  = merchantID;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = null;//new PaymentMethod() // dummy place holder
        this.status = PaymentStatus.PENDING; //default case
        this.statusHistory = []
        this.failureReason = null;

        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateStatus(newStatus) {
        const now = new Date();
        this.status = newStatus;
        this.updatedAt = now

        this.statusHistory.push({
            status: newStatus,
            updatedAt: now
        });
    }

    getPaymentStatus() {
        return {
            orderID: this.orderID,
            status: this.status
        }
    }

    summary() {
        return {
            orderID: this.orderID,
            merchantID: this.merchantID,
            amount: this.amount,
            currency: this.currency,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    processPayment(paymentMethod) {
        if (!(paymentMethod instanceof PaymentMethod)) {
            throw new Error("Invalid payment method");
        }
        paymentMethod.execute(this);
    }
    
}

class PaymentMethod {
    constructor() {
        if (this.constructor === PaymentMethod) {
            throw new Error('PaymentMethod is an abstract class and cannot be initiated directly');
        }
    }

    execute(order) {
        throw new Error("Method 'execute(order)' must be implemented");
    }
}

class CardPayment extends PaymentMethod {
    constructor() {
        super(); // This is mandatory
    }
    execute(order) {
        console.log(`Processing card payment for order ${order.orderID}`);

        // Dummy simulation
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            order.updateStatus('SUCCESS');
        } else {
            order.updateStatus('FAILED');
        }
    }
}

class UpiPayments extends PaymentMethod {
    execute(order) {
        console.log(`Processing card payment for order ${order.orderID}`);

        // Dummy simulation
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            order.updateStatus('SUCCESS');
        } else {
            order.updateStatus('FAILED');
        }
    }
}

class WalletPayments extends PaymentMethod {
    execute(order) {
        console.log(`Processing card payment for order ${order.orderID}`);

        // Dummy simulation
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            order.updateStatus('SUCCESS');
        } else {
            order.updateStatus('FAILED');
        }
    }
}


let merchant = new MerchantService('saif', 'abc@gmail.com', '8765432', BusinessType.INVIDUAL, 'https.ekesnfesnjnjc.com')
merchant.merchantID
const order = new PaymentOrder(merchant.merchantID, 1000, 'INR');
order.processPayment(new CardPayment());
console.log(order.summary());



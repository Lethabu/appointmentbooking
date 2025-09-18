// Enhanced South African payment gateway integrations
import crypto from 'crypto';

export interface PaymentGatewayConfig {
  name: string;
  currency: string;
  testMode: boolean;
}

// PayFast Integration
export class PayFastGateway {
  private merchantId: string;
  private merchantKey: string;
  private passphrase: string;
  private testMode: boolean;

  constructor(config: { merchantId: string; merchantKey: string; passphrase: string; testMode?: boolean }) {
    this.merchantId = config.merchantId;
    this.merchantKey = config.merchantKey;
    this.passphrase = config.passphrase;
    this.testMode = config.testMode || false;
  }

  createPayment(params: {
    amount: number;
    itemName: string;
    itemDescription: string;
    merchantReference: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    customerEmail: string;
  }) {
    const paymentData = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      notify_url: params.notifyUrl,
      name_first: 'Customer',
      email_address: params.customerEmail,
      m_payment_id: params.merchantReference,
      amount: (params.amount / 100).toFixed(2),
      item_name: params.itemName,
      item_description: params.itemDescription,
    };

    const signature = this.generateSignature(paymentData);
    const baseUrl = this.testMode ? 'https://sandbox.payfast.co.za' : 'https://www.payfast.co.za';

    return {
      url: `${baseUrl}/eng/process`,
      data: { ...paymentData, signature },
    };
  }

  private generateSignature(data: Record<string, string>): string {
    const queryString = Object.keys(data)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    
    const signatureString = `${queryString}&passphrase=${encodeURIComponent(this.passphrase)}`;
    return crypto.createHash('md5').update(signatureString).digest('hex');
  }

  verifySignature(data: Record<string, string>): boolean {
    const { signature, ...paymentData } = data;
    const expectedSignature = this.generateSignature(paymentData);
    return signature === expectedSignature;
  }
}

// Yoco Integration
export class YocoGateway {
  private secretKey: string;
  private publicKey: string;
  private testMode: boolean;

  constructor(config: { secretKey: string; publicKey: string; testMode?: boolean }) {
    this.secretKey = config.secretKey;
    this.publicKey = config.publicKey;
    this.testMode = config.testMode || false;
  }

  async createPayment(params: {
    amount: number;
    currency: string;
    description: string;
    metadata: Record<string, any>;
  }) {
    const baseUrl = this.testMode ? 'https://api.yoco.com/v1' : 'https://api.yoco.com/v1';
    
    const response = await fetch(`${baseUrl}/charges`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        metadata: params.metadata,
      }),
    });

    return response.json();
  }
}

// Enhanced Paystack for ZAR
export class PaystackZARGateway {
  private secretKey: string;
  private testMode: boolean;

  constructor(config: { secretKey: string; testMode?: boolean }) {
    this.secretKey = config.secretKey;
    this.testMode = config.testMode || false;
  }

  async initializeTransaction(params: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
    metadata: Record<string, any>;
  }) {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        currency: 'ZAR',
      }),
    });

    return response.json();
  }

  async verifyTransaction(reference: string) {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
      },
    });

    return response.json();
  }
}

// Payment Gateway Factory
export class PaymentGatewayFactory {
  static create(gateway: 'payfast' | 'yoco' | 'paystack', config: any) {
    switch (gateway) {
      case 'payfast':
        return new PayFastGateway(config);
      case 'yoco':
        return new YocoGateway(config);
      case 'paystack':
        return new PaystackZARGateway(config);
      default:
        throw new Error(`Unsupported gateway: ${gateway}`);
    }
  }
}

// Multi-gateway payment processor
export class MultiGatewayProcessor {
  private gateways: Map<string, any> = new Map();

  addGateway(name: string, gateway: any) {
    this.gateways.set(name, gateway);
  }

  async processPayment(gatewayName: string, params: any) {
    const gateway = this.gateways.get(gatewayName);
    if (!gateway) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }

    try {
      return await gateway.createPayment(params);
    } catch (error) {
      console.error(`Payment failed with ${gatewayName}:`, error);
      throw error;
    }
  }

  // Smart routing based on amount and customer location
  selectOptimalGateway(amount: number, customerData: any): string {
    // For high-value transactions, prefer PayFast
    if (amount > 100000) return 'payfast';
    
    // For mobile users, prefer Yoco
    if (customerData.isMobile) return 'yoco';
    
    // Default to Paystack
    return 'paystack';
  }
}

// Export convenience function for backward compatibility
export const createPaystackPayment = async (amount: number, email: string, reference: string) => {
  const gateway = new PaystackZARGateway({ 
    secretKey: process.env.PAYSTACK_SECRET_KEY!, 
    testMode: process.env.NODE_ENV !== 'production' 
  });
  
  return gateway.initializeTransaction({
    email,
    amount: amount * 100,
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
    metadata: {}
  });
};
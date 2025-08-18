import Stripe from 'stripe'

// Payment providers configuration
const providers = {
  stripe: {
    client: new Stripe(process.env.STRIPE_SECRET_KEY),
    enabled: !!process.env.STRIPE_SECRET_KEY
  },
  paystack: {
    enabled: !!process.env.PAYSTACK_SECRET_KEY,
    secretKey: process.env.PAYSTACK_SECRET_KEY
  },
  netcash: {
    enabled: !!process.env.NETCASH_API_KEY,
    apiKey: process.env.NETCASH_API_KEY
  }
}

export class PaymentService {
  constructor(provider = 'stripe') {
    this.provider = provider
    this.client = providers[provider]?.client
  }

  async createPaymentIntent(amount, currency = 'ZAR', metadata = {}) {
    switch (this.provider) {
      case 'stripe':
        return await this.createStripePaymentIntent(amount, currency, metadata)
      case 'paystack':
        return await this.createPaystackPayment(amount, currency, metadata)
      case 'netcash':
        return await this.createNetcashPayment(amount, currency, metadata)
      default:
        throw new Error(`Unsupported payment provider: ${this.provider}`)
    }
  }

  async createStripePaymentIntent(amount, currency, metadata) {
    if (!providers.stripe.enabled) {
      throw new Error('Stripe is not configured')
    }

    try {
      const paymentIntent = await providers.stripe.client.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        provider: 'stripe'
      }
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error)
      return {
        success: false,
        error: error.message,
        provider: 'stripe'
      }
    }
  }

  async createPaystackPayment(amount, currency, metadata) {
    if (!providers.paystack.enabled) {
      throw new Error('Paystack is not configured')
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${providers.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to kobo
          currency: currency.toUpperCase(),
          metadata,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/paystack/callback`,
        }),
      })

      const data = await response.json()

      if (data.status) {
        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          reference: data.data.reference,
          provider: 'paystack'
        }
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Paystack payment creation failed:', error)
      return {
        success: false,
        error: error.message,
        provider: 'paystack'
      }
    }
  }

  async verifyPayment(paymentId, provider = this.provider) {
    switch (provider) {
      case 'stripe':
        return await this.verifyStripePayment(paymentId)
      case 'paystack':
        return await this.verifyPaystackPayment(paymentId)
      default:
        throw new Error(`Unsupported payment provider: ${provider}`)
    }
  }

  async verifyStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await providers.stripe.client.paymentIntents.retrieve(paymentIntentId)
      
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        metadata: paymentIntent.metadata,
        provider: 'stripe'
      }
    } catch (error) {
      console.error('Stripe payment verification failed:', error)
      return {
        success: false,
        error: error.message,
        provider: 'stripe'
      }
    }
  }

  static getAvailableProviders() {
    return Object.entries(providers)
      .filter(([_, config]) => config.enabled)
      .map(([name]) => name)
  }
}

export default PaymentService
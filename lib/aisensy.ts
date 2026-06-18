// Enhanced AiSensy WhatsApp Business API Integration with catalog support

export interface WhatsAppCatalogItem {
  retailer_id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  image_url: string;
  category: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export class AiSensyClient {
  private apiUrl = process.env.AISENSY_API_URL || 'https://backend.aisensy.com/campaign/t1/api/v2';
  private apiKey = process.env.AISENSY_API_KEY!;

  async sendTemplate(to: string, templateName: string, parameters: string[] = []) {
    const response = await fetch(`${this.apiUrl}/sendTemplateMessage`, {
      method: 'POST',
      headers: {
        'X-AiSensy-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: this.apiKey,
        campaignName: templateName,
        destination: to,
        userName: 'InStyle Hair Boutique',
        templateParams: parameters,
        source: 'new-landing-page form',
        media: {},
        buttons: {},
        carouselCards: [],
        location: {},
        paramsFallbackValue: {
          FirstName: 'Customer'
        }
      }),
    });

    return response.json();
  }

  async sendMessage(to: string, message: string) {
    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'X-AiSensy-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: this.apiKey,
        destination: to,
        userName: 'InStyle Hair Boutique',
        message: {
          text: message
        }
      }),
    });

    return response.json();
  }

  async sendCatalogMessage(to: string, catalogId: string, headerText: string = 'Check out our products!') {
    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'X-AiSensy-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: this.apiKey,
        destination: to,
        userName: 'InStyle Hair Boutique',
        message: {
          type: 'interactive',
          interactive: {
            type: 'catalog_message',
            header: {
              type: 'text',
              text: headerText
            },
            body: {
              text: 'Browse our premium hair products and services. Tap to view details and make a purchase.'
            },
            action: {
              name: 'catalog_message',
              parameters: {
                thumbnail_product_retailer_id: catalogId
              }
            }
          }
        }
      }),
    });

    return response.json();
  }

  async syncCatalog(items: WhatsAppCatalogItem[]) {
    // Note: This is a simplified implementation
    // In production, you'd use Facebook Business API to sync catalog
    const response = await fetch(`${this.apiUrl}/syncCatalog`, {
      method: 'POST',
      headers: {
        'X-AiSensy-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: this.apiKey,
        catalog: {
          name: 'InStyle Hair Boutique Catalog',
          items: items
        }
      }),
    });

    const result = await response.json();
    return {
      catalog_id: result.catalog_id || 'instyle_catalog_' + Date.now(),
      success: result.success || true
    };
  }

  async sendProductMessage(to: string, product: {
    name: string;
    description: string;
    price: string;
    image_url: string;
    product_id: string;
  }) {
    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'X-AiSensy-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: this.apiKey,
        destination: to,
        userName: 'InStyle Hair Boutique',
        message: {
          type: 'interactive',
          interactive: {
            type: 'product',
            body: {
              text: product.description
            },
            action: {
              catalog_id: 'instyle_catalog',
              product_retailer_id: product.product_id
            }
          }
        }
      }),
    });

    return response.json();
  }

  // Predefined templates for InStyle Hair Boutique
  async sendBookingConfirmation(to: string, bookingDetails: {
    service: string;
    date: string;
    time: string;
    price: string;
  }) {
    return this.sendTemplate(to, 'booking_confirmation', [
      bookingDetails.service,
      bookingDetails.date,
      bookingDetails.time,
      bookingDetails.price
    ]);
  }

  async sendAbandonedCartReminder(to: string, cartDetails: {
    productName: string;
    totalAmount: string;
    cartUrl: string;
  }) {
    return this.sendTemplate(to, 'abandoned_cart_recovery', [
      cartDetails.productName,
      cartDetails.totalAmount,
      cartDetails.cartUrl
    ]);
  }

  async sendUpsellMessage(to: string, upsellDetails: {
    customerName: string;
    recommendedProduct: string;
    discount: string;
  }) {
    return this.sendTemplate(to, 'wig_care_upsell', [
      upsellDetails.customerName,
      upsellDetails.recommendedProduct,
      upsellDetails.discount
    ]);
  }

  async sendOrderConfirmation(to: string, orderDetails: {
    orderNumber: string;
    totalAmount: string;
    deliveryDate: string;
  }) {
    return this.sendTemplate(to, 'order_confirmation', [
      orderDetails.orderNumber,
      orderDetails.totalAmount,
      orderDetails.deliveryDate
    ]);
  }
}

export const aisensy = new AiSensyClient();
// AiSensy WhatsApp Business API Integration

export class AiSensyClient {
  private apiUrl = process.env.AISENSY_API_URL!;
  private apiKey = process.env.AISENSY_API_KEY!;

  async sendTemplate(to: string, templateName: string, parameters: any[] = []) {
    const response = await fetch(`${this.apiUrl}/sendTemplate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        template: templateName,
        language: 'en',
        parameters,
      }),
    });

    return response.json();
  }

  async sendMessage(to: string, message: string) {
    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        type: 'text',
        text: { body: message },
      }),
    });

    return response.json();
  }
}

export const aisensy = new AiSensyClient();

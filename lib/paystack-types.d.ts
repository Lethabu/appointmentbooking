declare module '@paystack/inline-js' {
  interface TransactionParams {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference: string;
    metadata?: {
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    onSuccess: (response: any) => void;
    onCancel: () => void;
  }

  class PaystackPop {
    newTransaction(params: TransactionParams): void;
  }

  export = PaystackPop;
}

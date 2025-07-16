// src/types/braintree-applepay.d.ts
declare module "braintree-web" {
  namespace client {
    function create(options: {
      authorization: string;
    }): Promise<BraintreeClient>;
  }

  interface BraintreeClient {}

  namespace applePay {
    interface ApplePay {
      isApplePaySupported(): boolean;
      canMakePayments(): boolean;
      createPaymentRequest(options: {
        total: { label: string; amount: string };
        requiredBillingContactFields?: string[];
      }): ApplePayJS.ApplePayPaymentRequest;
      performValidation(options: {
        validationURL: string;
        displayName: string;
      }): Promise<ApplePayJS.ApplePayMerchantSession>;
      tokenize(options: {
        token: ApplePayJS.ApplePayPaymentToken;
      }): Promise<{ nonce: string }>;
    }

    function create(options: { client: BraintreeClient }): Promise<ApplePay>;
  }
}

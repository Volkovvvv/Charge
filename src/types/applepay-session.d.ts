// src/types/applepay-session.d.ts
interface ApplePaySession {
  new (
    version: number,
    paymentRequest: ApplePayJS.ApplePayPaymentRequest
  ): ApplePaySession;
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePayment(status: number): void;
  onvalidatemerchant: (event: any) => void;
  onpaymentauthorized: (event: any) => void;
}

declare var ApplePaySession: {
  new (
    version: number,
    paymentRequest: ApplePayJS.ApplePayPaymentRequest
  ): ApplePaySession;
  canMakePayments(): boolean;
  supportsVersion(version: number): boolean;
  readonly STATUS_SUCCESS: number;
  readonly STATUS_FAILURE: number;
};

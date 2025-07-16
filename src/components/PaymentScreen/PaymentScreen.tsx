import React, { useState, useEffect, useRef, useCallback } from "react";

import { message } from "antd";
import axios from "axios";
import * as braintree from "braintree-web";
import styles from "./PaymentScreen.module.scss";
import logo from "../../img/logo.png";
import apple from "../../img/apple.png";

const PaymentScreen: React.FC = () => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const applePayInstance = useRef<braintree.applePay.ApplePay | null>(null);

  console.log(applePayAvailable, "applePayAvailable");
  const generateAccount = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/auth/apple/generate-account"
      );
      setAccessToken(data.accessJwt);
      localStorage.setItem("refreshJwt", data.refreshJwt);
      await generateBraintreeClientToken(data.accessJwt);
    } catch (err) {
      console.error("Ошибка генерации аккаунта:", err);
      message.error("Не удалось создать аккаунт");
    }
  }, []);

  const generateBraintreeClientToken = async (token: string) => {
    try {
      const { data } = await axios.get(
        "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/generate-and-save-braintree-client-token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClientToken(data);
    } catch (err) {
      console.error("Ошибка получения client token:", err);
      message.error("Не удалось получить токен оплаты");
    }
  };

  useEffect(() => {
    generateAccount();
  }, [generateAccount]);

  useEffect(() => {
    if (!clientToken) return;

    braintree.client
      .create({ authorization: clientToken })
      .then((clientInstance) =>
        braintree.applePay.create({ client: clientInstance })
      )
      .then((applePay) => {
        applePayInstance.current = applePay;
        console.log(applePay, "applePay");
        console.log(
          "➡ merchantIdentifier:",
          (applePay as any).merchantIdentifier
        );
        if (typeof window.ApplePaySession !== "undefined") {
          (ApplePaySession as any)
            .canMakePaymentsWithActiveCard((applePay as any).merchantIdentifier)
            .then((canPay: boolean) => {
              console.log(canPay, "canPay");
              setApplePayAvailable(canPay);
            })
            .catch((err: any) => {
              console.error("Ошибка проверки Apple Pay:", err);
              setApplePayAvailable(false);
            });
          console.log("не андефайнед");
        } else {
          console.log("undefined");
        }
      })
      .catch((err) => {
        console.error("Ошибка инициализации Apple Pay:", err);
        setApplePayAvailable(false);
      });
  }, [clientToken]);

  const onApplePayClick = () => {
    if (!applePayInstance.current || !accessToken) {
      return message.error("Apple Pay не готов к использованию");
    }

    const paymentRequest = applePayInstance.current.createPaymentRequest({
      total: { label: "Recharge City", amount: "4.99" },
      requiredBillingContactFields: ["postalAddress", "email"],
    });

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {
      try {
        const merchantSession =
          await applePayInstance.current!.performValidation({
            validationURL: event.validationURL,
            displayName: "Recharge City",
          });
        session.completeMerchantValidation(merchantSession);
      } catch (err) {
        console.error("Ошибка валидации Apple Pay мерчанта:", err);
        session.abort();
      }
    };

    session.onpaymentauthorized = async (event) => {
      try {
        setProcessingPayment(true);

        const { nonce } = await applePayInstance.current!.tokenize({
          token: event.payment.token,
        });

        await axios.post(
          "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/subscription/create-subscription-transaction-v2?disableWelcomeDiscount=false&welcomeDiscount=10",
          {
            paymentToken: nonce,
            thePlanId: "tss2",
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        message.success("Платеж прошёл успешно!");
      } catch (err) {
        console.error("Ошибка во время оплаты:", err);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        message.error("Ошибка оплаты");
      } finally {
        setProcessingPayment(false);
      }
    };

    session.begin();
  };

  return (
    <section>
      {typeof window.ApplePaySession !== "undefined"
        ? "applePaySession есть"
        : "applePaySession нет"}
      {applePayAvailable ? "доступно" : "не доступно"}
      <header className={styles.header}>
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
        <span>recharge.city</span>
      </header>

      <main className={styles.main}>
        <h2>Rent a charger</h2>
        <div className={styles.price}>
          <p>$4.99</p>
          <p className={styles.oldPrice}>$15.99</p>
        </div>
        <p>Select Payment Method</p>

        <button
          className={styles.applePayButton}
          onClick={onApplePayClick}
          disabled={!applePayAvailable || processingPayment}
        >
          <img src={apple} alt="Apple Pay" width={20} height={20} />
          <span>
            {processingPayment ? "Processing..." : "Pay with Apple Pay"}
          </span>
        </button>

        <button className={styles.payButton}>Debit or credit card</button>
      </main>
    </section>
  );
};

export default PaymentScreen;

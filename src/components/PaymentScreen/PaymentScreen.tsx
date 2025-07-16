// import React, { useState, useEffect, useRef, useCallback } from "react";

// import { message } from "antd";
// import axios from "axios";
// import * as braintree from "braintree-web";
// import styles from "./PaymentScreen.module.scss";
// import logo from "../../img/logo.png";
// import apple from "../../img/apple.png";

// const PaymentScreen: React.FC = () => {
//   const [clientToken, setClientToken] = useState<string | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [applePayAvailable, setApplePayAvailable] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const applePayInstance = useRef<braintree.applePay.ApplePay | null>(null);
//   const [canPay, setCanPay] = useState<boolean>(false);
//   const [error, setError] = useState<any>();

//   console.log(applePayAvailable, "applePayAvailable");
//   const generateAccount = useCallback(async () => {
//     try {
//       const { data } = await axios.get(
//         "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/auth/apple/generate-account"
//       );
//       setAccessToken(data.accessJwt);
//       localStorage.setItem("refreshJwt", data.refreshJwt);
//       await generateBraintreeClientToken(data.accessJwt);
//     } catch (err) {
//       console.error("Ошибка генерации аккаунта:", err);
//       message.error("Не удалось создать аккаунт");
//     }
//   }, []);

//   const generateBraintreeClientToken = async (token: string) => {
//     try {
//       const { data } = await axios.get(
//         "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/generate-and-save-braintree-client-token",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setClientToken(data);
//     } catch (err) {
//       console.error("Ошибка получения client token:", err);
//       message.error("Не удалось получить токен оплаты");
//     }
//   };

//   useEffect(() => {
//     generateAccount();
//   }, [generateAccount]);

//   useEffect(() => {
//     if (!clientToken) return;

//     braintree.client
//       .create({ authorization: clientToken })
//       .then((clientInstance) =>
//         braintree.applePay.create({ client: clientInstance })
//       )
//       .then((applePay) => {
//         applePayInstance.current = applePay;
//         console.log(applePay, "applePay");
//         console.log(
//           "➡ merchantIdentifier:",
//           (applePay as any).merchantIdentifier
//         );
//         if (typeof window.ApplePaySession !== "undefined") {
//           (ApplePaySession as any)
//             .canMakePaymentsWithActiveCard((applePay as any).merchantIdentifier)
//             .then((canPay: boolean) => {
//               setCanPay(canPay);
//               setApplePayAvailable(canPay);
//             })
//             .catch((err: any) => {
//               setError(err);
//               console.error("Ошибка проверки Apple Pay:", err);
//               setApplePayAvailable(false);
//             });
//           console.log("не андефайнед");
//         } else {
//           console.log("undefined");
//         }
//       })
//       .catch((err) => {
//         console.error("Ошибка инициализации Apple Pay:", err);
//         setApplePayAvailable(false);
//       });
//   }, [clientToken]);

//   const onApplePayClick = () => {
//     if (!applePayInstance.current || !accessToken) {
//       return message.error("Apple Pay не готов к использованию");
//     }

//     const paymentRequest = applePayInstance.current.createPaymentRequest({
//       total: { label: "Recharge City", amount: "4.99" },
//       requiredBillingContactFields: ["postalAddress", "email"],
//     });

//     const session = new ApplePaySession(3, paymentRequest);

//     session.onvalidatemerchant = async (event) => {
//       try {
//         const merchantSession =
//           await applePayInstance.current!.performValidation({
//             validationURL: event.validationURL,
//             displayName: "Recharge City",
//           });
//         session.completeMerchantValidation(merchantSession);
//       } catch (err) {
//         console.error("Ошибка валидации Apple Pay мерчанта:", err);
//         session.abort();
//       }
//     };

//     session.onpaymentauthorized = async (event) => {
//       try {
//         setProcessingPayment(true);

//         const { nonce } = await applePayInstance.current!.tokenize({
//           token: event.payment.token,
//         });

//         await axios.post(
//           "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/subscription/create-subscription-transaction-v2?disableWelcomeDiscount=false&welcomeDiscount=10",
//           {
//             paymentToken: nonce,
//             thePlanId: "tss2",
//           },
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }
//         );

//         session.completePayment(ApplePaySession.STATUS_SUCCESS);
//         message.success("Платеж прошёл успешно!");
//       } catch (err) {
//         console.error("Ошибка во время оплаты:", err);
//         session.completePayment(ApplePaySession.STATUS_FAILURE);
//         message.error("Ошибка оплаты");
//       } finally {
//         setProcessingPayment(false);
//       }
//     };

//     session.begin();
//   };

//   return (
//     <section>
//       {typeof window.ApplePaySession !== "undefined"
//         ? "applePaySession есть"
//         : "applePaySession нет"}
//       {/* {applePayAvailable ? "доступно" : "не доступно"} */}
//       {canPay ? "CANPAY TRUE" : "CANPAY FALSE"}
//       {error ? `error ${error}` : "ошибки нет"}
//       <header className={styles.header}>
//         <a href="/">
//           <img src={logo} alt="logo" />
//         </a>
//         <span>recharge.city</span>
//       </header>

//       <main className={styles.main}>
//         <h2>Rent a charger</h2>
//         <div className={styles.price}>
//           <p>$4.99</p>
//           <p className={styles.oldPrice}>$15.99</p>
//         </div>
//         <p>Select Payment Method</p>

//         <button
//           className={styles.applePayButton}
//           onClick={onApplePayClick}
//           disabled={!applePayAvailable || processingPayment}
//         >
//           <img src={apple} alt="Apple Pay" width={20} height={20} />
//           <span>
//             {processingPayment ? "Processing..." : "Pay with Apple Pay"}
//           </span>
//         </button>

//         <button className={styles.payButton}>Debit or credit card</button>
//       </main>
//     </section>
//   );
// };

// export default PaymentScreen;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import * as braintree from "braintree-web";
import hostedFields from "braintree-web/hosted-fields";
import styles from "./PaymentScreen.module.scss";
import logo from "../../img/logo.png";
import apple from "../../img/apple.png";
import BottomSheetModal from "./BottomSheetModal";
import { useNavigate, useParams } from "react-router-dom";
import cards from "../../img/cards.svg";

const PaymentScreen: React.FC = () => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isFieldsLoading, setIsFieldsLoading] = useState(false);

  const applePayInstance = useRef<braintree.applePay.ApplePay | null>(null);
  const hostedFieldsInstance = useRef<any | null>(null);
  const navigate = useNavigate();

  const { stationId } = useParams();

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
    if (!showCardModal && hostedFieldsInstance.current) {
      hostedFieldsInstance.current.teardown().then(() => {
        hostedFieldsInstance.current = null;
        ["card-number", "cvv", "expiration-date"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = "";
        });
      });
    }
  }, [showCardModal]);

  useEffect(() => {
    if (!clientToken) return;

    braintree.client
      .create({ authorization: clientToken })
      .then((clientInstance) =>
        braintree.applePay.create({ client: clientInstance })
      )
      .then((applePay) => {
        applePayInstance.current = applePay;
        if (typeof window.ApplePaySession !== "undefined") {
          (ApplePaySession as any)
            .canMakePaymentsWithActiveCard((applePay as any).merchantIdentifier)
            .then((canPay: boolean) => {
              setApplePayAvailable(canPay);
            })
            .catch((err: any) => {
              setApplePayAvailable(false);
            });
        }
      })
      .catch((err) => {
        console.error("Ошибка инициализации Apple Pay:", err);
        setApplePayAvailable(false);
      });
  }, [clientToken]);

  useEffect(() => {
    if (!showCardModal || !clientToken || hostedFieldsInstance.current) return;
    setIsFieldsLoading(true);
    let clientInstance: any;

    braintree.client
      .create({ authorization: clientToken })
      .then((client) => {
        clientInstance = client;
        return hostedFields.create({
          client: clientInstance,
          styles: {
            input: {
              "font-size": "16px",
              "font-weight": "300",
              color: "#3a3a3a",
              border: "1px solid black",
            },
            ":focus": {
              color: "black",
            },
            ".valid": {
              color: "green",
            },
            ".invalid": {
              color: "red",
            },
          },
          fields: {
            number: {
              selector: "#card-number",
              placeholder: "Card number",
            },
            cvv: {
              selector: "#cvv",
              placeholder: "CVV",
            },
            expirationDate: {
              selector: "#expiration-date",
              placeholder: "Month/Year",
            },
          },
        });
      })
      .then((hostedFields) => {
        hostedFieldsInstance.current = hostedFields;
        setIsFieldsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка инициализации Hosted Fields:", err);
        setIsFieldsLoading(false);
      });
  }, [showCardModal, clientToken]);

  const onApplePayClick = () => {
    if (!applePayInstance.current || !accessToken) {
      return message.error("Apple Pay не готов к использованию");
    }

    const paymentRequest = applePayInstance.current.createPaymentRequest({
      total: { label: "Recharge City", amount: "0.00" },
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
          "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/subscription/create-subscription-transaction-v2?disableWelcomeDiscount=false&welcomeDiscount=14.98",
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
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        message.error("Ошибка оплаты");
      } finally {
        setProcessingPayment(false);
      }
    };

    session.begin();
  };

  const onCardPayClick = async () => {
    if (!hostedFieldsInstance.current || !accessToken) {
      return message.error("Платежная форма не готова");
    }

    setProcessingPayment(true);

    try {
      const payload = await hostedFieldsInstance.current.tokenize();

      const paymentToken = await axios.post(
        "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/add-payment-method",
        {
          paymentNonceFromTheClient: payload.nonce,
          description: "string",
          paymentType: "card",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await axios.post(
        "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/subscription/create-subscription-transaction-v2?disableWelcomeDiscount=false&welcomeDiscount=14.99",

        {
          paymentToken: paymentToken.data,
          thePlanId: "tss2",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await axios.post(
        "https://goldfish-app-3lf7u.ondigitalocean.app/api/v1/payments/rent-power-bank",
        {
          cabinetId: stationId,
          connectionKey:
            "1ae94dc1496c1fee96cb663c79b817294a36d625cef2b64c097c908f2507f259",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      message.success("Платеж прошёл успешно!");
      navigate(`/success/${stationId}`);
      setShowCardModal(false);
    } catch (err) {
      // navigate("/error");
      navigate(`/success/${stationId}`);
      message.error("Ошибка оплаты");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <Spin spinning={processingPayment}>
      {" "}
      <section>
        <main className={styles.main}>
          <header className={styles.header}>
            <a href="/">
              <img src={logo} alt="logo" />
            </a>
            <span className={styles.logotext}>recharge.city</span>
          </header>
          <h2 style={{ padding: 0 }}>Rent a Charger</h2>
          <div className={styles.price}>
            <p style={{ fontSize: "38px" }}>$4.99</p>
            <p className={styles.oldPrice}>$15.99</p>
          </div>
          <p style={{ marginTop: "40px" }}>Select Payment Method</p>
          <button
            className={styles.applePayButton}
            onClick={onApplePayClick}
            disabled={!applePayAvailable || processingPayment}
          >
            <img src={apple} alt="Apple Pay" width={20} height={20} />
            <span>{processingPayment ? "Processing..." : "Pay"}</span>
          </button>
          <button
            className={styles.openPay}
            onClick={() => setShowCardModal(true)}
            disabled={processingPayment}
          >
            <p style={{ color: "#000" }}>Debit or credit card</p>
          </button>{" "}
          <BottomSheetModal
            visible={showCardModal}
            onClose={() => setShowCardModal(false)}
          >
            <div className="relative">
              <p style={{ textAlign: "center", fontSize: "20px" }}>
                Enter your card details
              </p>
              <Spin spinning={isFieldsLoading}>
                {" "}
                <div className={styles.container}>
                  {" "}
                  <div className={styles.containerInputs}>
                    <div className={styles.debitWrapper}>
                      {" "}
                      <img src={cards} alt="" />
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: "900",
                        }}
                      >
                        Debit or credit card
                      </p>
                    </div>

                    <div id="card-number" className={styles.input} />
                    <input
                      type="text"
                      id="cardholder-name"
                      placeholder="Имя"
                      className={styles.inputName}
                    />
                    <div className={styles.rowInputs}>
                      <div id="expiration-date" className={styles.inputHalf} />
                      <div id="cvv" className={styles.inputCvv} />
                    </div>
                  </div>
                  <button
                    className={styles.payButton}
                    onClick={onCardPayClick}
                    disabled={processingPayment}
                  >
                    Continue
                  </button>
                </div>
              </Spin>
            </div>
          </BottomSheetModal>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "300",
              color: "#909090",
              width: "200px",
              textAlign: "center",
              margin: "0 auto",
              marginTop: "25px",
            }}
          >
            If the battery is not returned within 14 days or is lost, a $99 fee
            will apply.
          </p>
          <p
            className={styles.footerText}
            style={{
              fontSize: "7px",
              fontWeight: "300",
              color: "#909090",
              width: "200px",
              textAlign: "center",
              margin: "0 auto",
              marginTop: "25px",
            }}
          >
            Nothing happened? Contact support
          </p>
        </main>
      </section>
    </Spin>
  );
};

export default PaymentScreen;

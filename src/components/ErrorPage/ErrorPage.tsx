import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.scss";

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.errorSection}>
      <div className={styles.errorContainer}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.errorIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className={styles.title}>Payment error</h2>
        <p className={styles.message}>
          Unfortunately, your payment failed. Please check the card details. or
          choose another payment method.
        </p>
        <button
          className={styles.retryButton}
          onClick={() => navigate("/payment/RECH082203000350")}
        >
          Try again
        </button>
        <p className={styles.supportText}>
          If the problem persists, please contact{" "}
          <a href="mailto:support@recharge.city" className={styles.supportLink}>
            support
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;

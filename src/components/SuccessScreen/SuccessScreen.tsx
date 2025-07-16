import React, { useEffect } from "react";
import styles from "./SuccessScreen.module.scss";
import logo from "../../img/logo.png";
import receipt from "../../img/receipt-item.svg";
import circle from "../../img/circle.svg";
import success from "../../img/success_2.svg";
import return1 from "../../img/return.svg";
import geo from "../../img/Pin_alt.svg";
import { useParams } from "react-router-dom";

const SuccessScreen: React.FC = () => {
  const { stationId } = useParams();

  // Прокрутка к верху страницы при монтировании
  useEffect(() => {
    window.scrollTo(0, 0); // Прокручиваем к началу страницы
  }, []); // Пустой массив зависимостей — выполняется только при монтировании

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
        <span className={styles.logotext}>recharge.city</span>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.title}>Charger Ejected!</h2>
          <div className={styles.orderInfo}>
            <img src={receipt} alt="" />
            <p className={styles.orderId}>Order ID: #95730630547</p>
          </div>
          <div className={styles.rentalInfo}>
            <div className={styles.orderInfo}>
              <img src={circle} alt="" />
              <p className={styles.rentalInfoItem}>Rental information</p>
            </div>
            <p className={styles.rentalInfoItem}>
              {`Power bank ID: ${stationId}`}
            </p>
            <p className={styles.rentalInfoItem}>
              Started at: 02/11/2024 01:13:55
            </p>
            <p className={styles.rentalInfoItem}>
              Rental location: Test location
            </p>
            <p className={styles.rentalInfoItem}>Venue name: Test location</p>
          </div>
          <div className={styles.instructions}>
            <h3 className={styles.title}>How to end my rental?</h3>
            <ul className={styles.instructionsList}>
              <li className={styles.instructionsItem}>
                <img src={geo} alt="" />
                <span className={styles.icon}></span> Find any Recharge station
              </li>
              <li className={styles.instructionsItem}>
                You can use the app to find one near you.
              </li>
              <li className={styles.instructionsItem}>
                <img src={return1} alt="" />
                <span className={styles.icon}></span> Return the charger by
                inserting it into any empty slot.
              </li>
              <li className={styles.instructionsItem}>
                <img src={success} alt="" />
                <span className={styles.icon}></span> Rental ends automatically!
              </li>
            </ul>
          </div>
          <button className={styles.downloadButton}>Download App</button>
        </div>
        <p className={styles.supportText}>Nothing happened? Contact support</p>
      </main>
    </div>
  );
};

export default SuccessScreen;

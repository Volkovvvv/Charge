import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaymentScreen from "./components/PaymentScreen/PaymentScreen";
import SuccessScreen from "./components/SuccessScreen/SuccessScreen";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PaymentScreen />} />
      <Route path="/payment/:stationId" element={<PaymentScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
      <Route path="/error" element={<ErrorPage />} />{" "}
      {/* Новый маршрут для ошибки */}
      <Route
        path="*"
        element={<Navigate to="/payment/RECH082203000350" replace />}
      />
    </Routes>
  </BrowserRouter>
);

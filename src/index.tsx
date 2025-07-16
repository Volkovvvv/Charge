import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaymentScreen from "./components/PaymentScreen/PaymentScreen";
import SuccessScreen from "./components/SuccessScreen/SuccessScreen";
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
></link>;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PaymentScreen />} />{" "}
      {/* Маршрут по умолчанию */}
      <Route path="/payment/:stationId" element={<PaymentScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
      {/* Опционально: перенаправление на тестовый stationId */}
      <Route
        path="*"
        element={<Navigate to="/payment/RECH082203000350" replace />}
      />
    </Routes>
  </BrowserRouter>
);

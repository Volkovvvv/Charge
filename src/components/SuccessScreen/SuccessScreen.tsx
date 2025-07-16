import React from "react";
import { Button, Card, Result } from "antd";
import { useNavigate } from "react-router-dom";

const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <Result
          status="success"
          title="Павербанк успешно выдан!"
          subTitle="Вы можете забрать павербанк из ячейки станции."
          extra={[
            <Button
              type="primary"
              key="app"
              className="w-full mb-2"
              onClick={() => (window.location.href = "https://example.com/app")}
            >
              Открыть приложение
            </Button>,
            <Button
              key="home"
              className="w-full"
              onClick={() => navigate("/payment/RECH082203000350")}
            >
              На главную
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default SuccessScreen;

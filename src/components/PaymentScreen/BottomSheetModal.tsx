import React, { useRef, useState } from "react";
import styles from "./PaymentScreen.module.scss";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheetModal: React.FC<Props> = ({ visible, onClose, children }) => {
  const startY = useRef(0);
  const [dragY, setDragY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={{ transform: `translateY(${dragY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.dragHandle}></div>
        {children}
      </div>
    </div>
  );
};

export default BottomSheetModal;

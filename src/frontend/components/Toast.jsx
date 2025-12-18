import React, { useState, useEffect } from "react";
import "./Toast.css";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast toast-success">
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useRef } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalRef = useRef();

  useEffect(() => {
    // Kiểm tra nếu SDK PayPal đã tải
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(), // Chuyển amount thành string cho chính xác
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details);
            });
          },
          onError: () => {
            alert("Error");
          },
        })
        .render(paypalRef.current);
    }
  }, [amount, onSuccess]); // Thêm phụ thuộc vào amount và onSuccess

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;

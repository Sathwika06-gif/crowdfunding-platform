import React from "react";
import { useParams } from "react-router-dom";

function Payment() {
  const { id } = useParams();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh"
    }}>
      <div style={{
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <h2>Payment Page 💳</h2>
        <p>Campaign ID: {id}</p>

        <input
          type="number"
          placeholder="Enter amount"
          style={{
            padding: "10px",
            width: "200px",
            marginBottom: "10px"
          }}
        />

        <br />

        <button style={{
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}>
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default Payment;
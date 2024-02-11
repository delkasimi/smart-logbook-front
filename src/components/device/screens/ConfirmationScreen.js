// ConfirmationScreen.js
import React from "react";

const ConfirmationScreen = ({ onClose }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px", // This will add vertical spacing between children
      }}
    >
      <img
        src="/confirmation.jpeg"
        style={{ maxWidth: "100%", margin: "20px 0" }}
      />
      <h3 style={{ margin: "20px 0" }}>Checklist saved !</h3>
      <button
        className="CloseButton"
        onClick={onClose}
        style={{ margin: "20px 0" }}
      >
        Close
      </button>
    </div>
  );
};

export default ConfirmationScreen;

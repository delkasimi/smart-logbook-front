import React from "react";

const ErrorScreen = ({ onClose }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <img src="/error.jpeg" style={{ maxWidth: "100%", margin: "20px 0" }} />
      <h3 style={{ margin: "20px 0" }}>
        An error occured, please retry later ... !
      </h3>
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

export default ErrorScreen;

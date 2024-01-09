// ChecklistConfirmation.js
import React from 'react';

const ChecklistConfirmation = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <p className="modal-message">{message}</p>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistConfirmation;

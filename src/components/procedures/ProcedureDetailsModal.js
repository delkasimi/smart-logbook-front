// ProcedureDetailsModal.js
import React from "react";
import GenericTable from "../generic/GenericTable";

const ProcedureDetailsModal = ({ onClose, procedureData, tablecolumns }) => {
  const data = [procedureData];
  return (
    <div className="modal-overlay open">
      <div className="modal-container">
        <h3>Procedure Details</h3>

        <GenericTable
          columns={tablecolumns}
          data={data}
          showPagination={false}
        />

        <div className="button-container">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="confirm-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetailsModal;

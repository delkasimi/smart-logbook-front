// CheckListEdit.js
import React, { useState } from 'react';

const CheckListEdit = ({ rowData, onSave, onClose, config }) => {
  const [editedData, setEditedData] = useState({
    ...config.defaultRowData,
    ...rowData,
  });

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <div className="modal-container">
      <h3>Edit Row</h3>
      {config.map((section, index) => (
        <div key={index}>
          {section.columns.map((column) => (
            <div className="form-group" key={column.accessor}>
              <label>{column.Header}</label>
              {column.type === 'select' ? (
                <select
                  value={editedData[column.accessor]}
                  onChange={(e) => handleInputChange(column.accessor, e.target.value)}
                >
                  {column.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={column.type || 'text'}
                  placeholder={column.Header}
                  value={editedData[column.accessor]}
                  onChange={(e) => handleInputChange(column.accessor, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="button-container">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckListEdit;

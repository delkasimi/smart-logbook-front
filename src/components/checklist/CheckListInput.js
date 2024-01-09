import React, { useState } from 'react';
import { format } from 'date-fns';

const CheckListInput = ({ onAddRow, onClose, config }) => {
  // Create state for each field based on the configuration
  const initialState = config.reduce((acc, section) => {
    section.columns.forEach((column) => {
      acc[column.accessor] = column.type === 'number' ? 0 : ''; // Set initial values based on type
    });
    return acc;
  }, {});

  const [inputValues, setInputValues] = useState(initialState);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleInputChange = (accessor, value) => {
    setInputValues((prev) => ({ ...prev, [accessor]: value }));
  };

  const handleAddClick = () => {
    const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd');
    const newRow = {
      ...inputValues,
      date: formattedDate,
    };

    onAddRow(newRow);
    onClose();
  };

  return (

    
    <div className="modal-container">
      <h3>Add Entry</h3>
      <div className={`grid-container ${config.length > 2 ? "three-columns" : ""}`}>

      {config.map((section) => (
        <div key={section.Header} className="grid-item">
          <h4>{section.Header}</h4>
          {section.columns.map((column) => (
            <div key={column.accessor} className="form-group">
              <label>{column.Header}</label>
              {column.type === 'select' ? (
                <select
                  value={inputValues[column.accessor]}
                  onChange={(e) => handleInputChange(column.accessor, e.target.value)}
                >
                  <option value="" disabled>
                    Select {column.Header}
                  </option>
                  {column.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : column.type === 'number' ? (
                <input
                  type="number"
                  placeholder={column.Header}
                  value={inputValues[column.accessor]}
                  onChange={(e) => handleInputChange(column.accessor, e.target.value)}
                />
              ) : column.type === 'date' ? (
                <input
                  type="date"
                  placeholder={column.Header}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  placeholder={column.Header}
                  value={inputValues[column.accessor]}
                  onChange={(e) => handleInputChange(column.accessor, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      </div>
      <div className="button-container">
        <button className="confirm-button" onClick={handleAddClick}>
          Add
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckListInput
;

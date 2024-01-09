import React, { useState, useEffect } from 'react';

const TicketInputRow = ({
  onClose,
  editingRow,
  onNextClick,
  formData,
  columns,
}) => {
  const [formValues, setFormValues] = useState({});


  useEffect(() => {
    const initialValues = {};
  
    columns.forEach(column => {
      if (column.key === 'status' && column.options && column.options.length > 0) {
        initialValues['status'] = column.options[0]; // Set the first option as default for status
      }
    });
  
    if (editingRow) {
      setFormValues({ ...initialValues, ...editingRow });
    } else if (formData) {
      setFormValues({ ...initialValues, ...formData });
    } else {
      setFormValues(initialValues);
    }
  }, [columns, editingRow, formData]);
  

  const handleNextClick = () => {
    onNextClick(formValues);
  };

  const handleInputChange = (key, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const resetForm = () => {
    setFormValues({});
  };

  const handleDependencies = (column) => {
    const dependencyColumnKey = column.dependancyColumn;
  
    if (dependencyColumnKey) {
      const dependencyColumn = columns.find((col) => col.key === dependencyColumnKey);
  
      if (dependencyColumn) {
        const dependencyValue = formValues[dependencyColumnKey];
  
        // Check if there is a dependency value and if it's a valid key in the options
        if (dependencyValue && column.options[dependencyValue]) {
          return column.options[dependencyValue];
        }
      }
    }
  
    // Return default options if no dependency or if the dependency is not valid
    return Array.isArray(column.options) ? column.options : [];
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
      <h3>Create New Ticket</h3>
        {columns.map((column) => (
          <div className="form-group" key={column.key}>
            <label htmlFor={column.key}>{column.label}:</label>
            {column.inputType === 'select' ? (
              <select
              id={column.key}
              value={formValues[column.key] || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
            >
              <option value="" disabled>
                Select {column.label}
              </option>
              {handleDependencies(column).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            ) : (
              <input
                type={column.inputType || 'text'}
                id={column.key}
                value={formValues[column.key] || ''}
                onChange={(e) => handleInputChange(column.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="button-container">
          
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleNextClick}>
            Next
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default TicketInputRow;

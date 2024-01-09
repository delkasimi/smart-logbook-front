import React, { useState, useEffect } from 'react';

const SolutionsFilter = ({ onFilterChange, columns, filter }) => {
  // Initialize filter values based on columns
  const initialFilterValues = Object.fromEntries(columns.map(column => [column.accessor, '']));

  const [filterValues, setFilterValues] = useState(initialFilterValues);

  
  useEffect(() => {
    // Update filterValues when the filter prop changes
    setFilterValues(filter || initialFilterValues);
  }, [filter, initialFilterValues]);

  const handleFilterChange = (filterType, value) => {
    const updatedFilterValues = { ...filterValues, [filterType]: value };
    setFilterValues(updatedFilterValues);
    onFilterChange(updatedFilterValues);
  };

  const handleReset = () => {
    setFilterValues(initialFilterValues);
    onFilterChange(initialFilterValues);
  };

  return (
    <div className="ticket-filter">
      {columns.map((column) => (
        <div key={column.accessor} className="filter-item">
          {column.inputType === 'select' && (
            <select
              value={filterValues[column.accessor]}
              onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
            >
              <option value="">Select {column.Header}</option>
              {column.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {column.inputType === 'date' && (
            <input
              type="date"
              value={filterValues[column.accessor]}
              onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
            />
          )}
        </div>
      ))}
      <button className="reset-button" onClick={handleReset}>Reset</button>
    </div>
  );
};

export default SolutionsFilter;

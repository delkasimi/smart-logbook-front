// TicketFilter.js

import React, { useState, useEffect } from 'react';

const TicketFilter = ({ onFilterChange, columns, filter }) => {
  const initialFilterValues = Object.fromEntries(columns.map(column => [column.key, '']));

  const [filterValues, setFilterValues] = useState(initialFilterValues);

  useEffect(() => {
    // Update filterValues when the filter prop changes
    setFilterValues(filter || initialFilterValues);
  }, [filter]);

  const handleFilterChange = (filterType, value) => {
    setFilterValues(prevValues => ({ ...prevValues, [filterType]: value }));
    onFilterChange({ ...filterValues, [filterType]: value });
  };

  const handleReset = () => {
    setFilterValues(initialFilterValues);
    onFilterChange(initialFilterValues);
  };

  const handleDependencies = (column) => {
    const dependencyColumnKey = column.dependancyColumn;

    if (dependencyColumnKey) {
      const dependencyColumn = columns.find((col) => col.key === dependencyColumnKey);

      if (dependencyColumn) {
        const dependencyValue = filterValues[dependencyColumnKey];

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
    <div className="ticket-filter">
      {/* Render filters based on columns and inputOptions */}
      {columns.map((column) => (
        <div key={column.key} className="filter-item">
          {column.inputType === 'select' && (
            <select
              value={filterValues[column.key]}
              onChange={(e) => handleFilterChange(column.key, e.target.value)}
            >
              <option value="">Select {column.label}</option>
              {handleDependencies(column).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {column.inputType === 'date' && (
            <input
              type="date"
              value={filterValues[column.key]}
              onChange={(e) => handleFilterChange(column.key, e.target.value)}
            />
          )}
        </div>
      ))}
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default TicketFilter;

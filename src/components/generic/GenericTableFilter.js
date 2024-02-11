import React from "react";
import Select from "react-select"; // Import Select from react-select

const GenericTableFilter = ({ columns, onFilterChange, filterValues }) => {
  const handleFilterChange = (filterType, selectedOption) => {
    // Call onFilterChange with the new values. If selectedOption is null, pass an empty string
    onFilterChange({
      ...filterValues,
      [filterType]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleReset = () => {
    // Reset all filters to their initial state
    const resetFilters = Object.keys(filterValues).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    onFilterChange(resetFilters);
  };

  return (
    <div className="ticket-filter">
      {columns.map((column) => (
        <div key={column.accessor} className="filter-item">
          {column.inputType === "select" && (
            <Select
              value={
                column.options?.find(
                  (option) =>
                    option.value === (filterValues?.[column.accessor] || "")
                ) || null
              }
              onChange={(selectedOption) =>
                handleFilterChange(column.accessor, selectedOption)
              }
              options={column.options}
              isClearable={true} // Allows clearing the selected value
              isSearchable={true} // Allows searching through the options
              placeholder={`Select ${column.label}`}
            />
          )}
          {column.inputType === "date" && (
            <input
              type="date"
              value={filterValues[column.accessor] || ""}
              onChange={(e) =>
                handleFilterChange(column.accessor, { value: e.target.value })
              }
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

export default GenericTableFilter;

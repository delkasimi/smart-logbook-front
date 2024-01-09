//ReportingFilter.js
import React from 'react';

const ReportingFilter = () => {
  return (
    <div className="filter-section">
      <input type="text" placeholder="Input 1" />
      <input type="text" placeholder="Input 2" />
      <select>
        <option>Select 1</option>
      </select>
      <select>
        <option>Select 2</option>
      </select>
      <select>
        <option>Select 3</option>
      </select>
      <button>Reset</button>
      <button>Filter</button>
    </div>
  );
};

export default ReportingFilter;

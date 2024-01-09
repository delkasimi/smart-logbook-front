import React from 'react';

const IssuesPerSystemTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Transform data to get counts per system
  const transformedData = transformDataForStackedBarChart(data);

  return (
    <div className="chart-container">
    
      <div style={{ width: '100%', height: '400px' }}>
        <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>System</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {transformedData.map(({ system, count }) => (
              <tr key={system}>
                <td>{system}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

const transformDataForStackedBarChart = (rawData) => {
  const systemCounts = rawData.reduce((acc, { system }) => {
    acc[system] = (acc[system] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(systemCounts).map(([system, count]) => ({
    system,
    count
  }));
};

export default IssuesPerSystemTable;

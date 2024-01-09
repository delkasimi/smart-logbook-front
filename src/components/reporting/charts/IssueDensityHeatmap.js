import React from 'react';
import Plot from 'react-plotly.js';

const IssueDensityHeatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  // Check for any potential issues in data
  const hasInvalidData = data.some(d => {
    return !d.system || !d.issue || typeof d.count !== 'number';
  });

  if (hasInvalidData) {
    console.error('Invalid data detected');
    return <div>Error in data</div>;
  }
  // Assuming 'data' is an array of objects with 'system', 'issue', and 'count' properties
  // First, generate a mapping from system and issueType to count
  const heatmapData = {};
  data.forEach(({ system, issue, count }) => {
    if (!heatmapData[system]) {
      heatmapData[system] = {};
    }
    heatmapData[system][issue] = count;
  });

  // Generate the arrays needed for the heatmap
  const xValues = [...new Set(data.map(item => item.issue))];
  const yValues = Object.keys(heatmapData);
  const zValues = yValues.map(system => xValues.map(issue => heatmapData[system][issue] || 0));

  return (
    <Plot
      data={[
        {
          x: xValues,
          y: yValues,
          z: zValues,
          type: 'heatmap',
          hoverongaps: false,
          colorscale: [
            [0.0, 'lightgreen'],  // Light green at the lowest end of the scale
            [0.33, 'green'],      // Green at one third of the scale
            [0.66, 'lightred'],   // Light red at two thirds of the scale
            [1.0, 'red']          // Red at the highest end of the scale
          ],
        },
      ]}
      layout={{
        title: 'Issue Density Heatmap',
        xaxis: { title: '' },
        yaxis: { title: '', autorange: 'reversed' },
        plot_bgcolor: 'rgba(0,0,0,0)', // Transparent background
        paper_bgcolor: 'rgba(0,0,0,0)', // Transparent surrounding
        showlegend: false, // Hide legend
        
      }}
      config={{
        displayModeBar: false, // Hide the modebar completely
        responsive: true,
      }}
    />
  );
};

export default IssueDensityHeatmap;

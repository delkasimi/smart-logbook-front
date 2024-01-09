import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';

const TopIssuesBarChart = ({ data }) => {

  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }
  
  const aggregateIssues = (data) => {
    const issueCounts = data.reduce((acc, item) => {
      const issue = item.issue || 'Unknown'; // Handle any undefined or null issues
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {});
  
    // Convert the aggregated counts into an array and sort it to get top issues
    return Object.entries(issueCounts)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const processedData = aggregateIssues(data);

  return (
    <div className="chart-container">
  <h3 className="chart-title">Top Frequent Issues</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="issue" type="category" width={120} style={{ fontSize: '10px' }}/>
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
};

export default TopIssuesBarChart;

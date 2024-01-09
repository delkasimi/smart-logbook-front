import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const StatusCountBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }
  
  const getStatusCounts = (data) => {
    const statusCounts = {};
  
    // Count the occurrences of each status
    data.forEach((item) => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
  
    // Transform the counts into an array suitable for the chart
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  };

  const COLORS = [
    '#0088FE', // Vivid blue
    '#00C49F', // Aqua green
    '#FFBB28', // Sunflower yellow
    '#FF8042', // Coral orange
    '#A569BD', // Amethyst purple
    '#F45B5B', // Terra cotta red
    '#76D7C4', // Mint green
    '#5DADE2', // Sky blue
    '#F7DC6F', // Mustard yellow
    '#82E0AA', // Light sea green
  ];
  
    // Use the getStatusCounts function to transform the data
    const chartData = getStatusCounts(data);
  
    return (
      
        <div className="chart-container">
        <h3 className="chart-title">Issues Count by Status</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="status" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                style={{ fontSize: '8px' }} // Adjust the font size as needed
              />
              <YAxis style={{ fontSize: '10px' }} allowDecimals={false} />
              <Tooltip />
              
              <Bar dataKey="count">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
                ))}
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
      </div>
    );
  };
  
  export default StatusCountBarChart;

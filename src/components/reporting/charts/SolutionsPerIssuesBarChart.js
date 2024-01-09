import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const SolutionPerIssuesBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }
    console.log('in solutions per issue data:', data);

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
  
    return(
      <div className="chart-container">
        <h3 className="chart-title">Solutions Count per issue</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="issue" 
                angle={-15} 
                textAnchor="end" 
                height={60}
                style={{ fontSize: '9px' }} // Adjust the font size as needed
              />
              <YAxis style={{ fontSize: '10px' }} allowDecimals={false} />
              <Tooltip />
              
              <Bar dataKey="count">
                {data.map((entry, index) => (
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



export default SolutionPerIssuesBarChart;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IssuesPerSystemStackedBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }
  const transformedData = transformDataForStackedBarChart(data);
  const subSystems = getUniqueSubSystems(data);

  return (
    
        <div className="chart-container">
        <h3 className="chart-title">Issues Count by Systems/SubSystems</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="system" angle={-45} textAnchor="end" interval={0} height={70} style={{ fontSize: '12px' }}/>
            <YAxis />
            <Tooltip />
            
            {subSystems.map(subSystem => (
              <Bar key={subSystem} dataKey={subSystem} stackId="a" fill={getRandomColor()} />
            ))}
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

const getUniqueSubSystems = (data) => {
  const allSubSystems = data.map(ticket => ticket.subSystem);
  return [...new Set(allSubSystems)];
};

const transformDataForStackedBarChart = (rawData) => {
  const systemMap = {};

  rawData.forEach(ticket => {
    if (!systemMap[ticket.system]) {
      systemMap[ticket.system] = {};
    }

    const systemEntry = systemMap[ticket.system];
    const subSystemName = ticket.subSystem || 'Unknown'; // Handle null or undefined subSystem
    systemEntry[subSystemName] = (systemEntry[subSystemName] || 0) + 1;
  });

  return Object.entries(systemMap).map(([system, subSystems]) => ({
    system,
    ...subSystems
  }));
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default IssuesPerSystemStackedBarChart;

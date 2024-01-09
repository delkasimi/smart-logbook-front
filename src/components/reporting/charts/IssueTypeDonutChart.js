import React from 'react';
import { PieChart, ResponsiveContainer, Pie, Legend, Tooltip, Cell } from 'recharts';

const COLORS_MAIN = ['#0088FE', '#00C49F', '#FFBB28'];
const COLORS_SUB = ['#FF8042', '#A569BD', '#F45B5B', '#76D7C4', '#5DADE2', '#F7DC6F', '#82E0AA'];

const IssueTypeDonutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }

  const aggregateIssueTypes = (data) => {
    const mainCounts = {};
    const subCounts = {};
  
    data.forEach(item => {
      const mainType = item.issueType || 'Unknown';
      const subType = item.issue || 'Unknown';
  
      mainCounts[mainType] = (mainCounts[mainType] || 0) + 1;
      subCounts[subType] = (subCounts[subType] || 0) + 1;
    });
  
    const mainData = Object.entries(mainCounts).map(([name, value]) => ({ name, value }));
    const subData = Object.entries(subCounts).map(([name, value]) => ({ name, value }));
  
    // Calculate totals for legend
    const mainTotals = mainData.map(item => ({ type: item.name, total: item.value }));
    const subTotals = subData.map(item => ({ type: item.name, total: item.value }));

    return { mainData, subData, mainTotals, subTotals };
  };

  const { mainData, subData, mainTotals, subTotals } = aggregateIssueTypes(data);

  // Combine totals for legend
  const customLegendPayload = [
    ...mainTotals.map(item => ({ value: `${item.type} (${item.total})`, type: 'square', color: "00C49F" })),
    ...subTotals.map(item => ({ value: `${item.type} (${item.total})`, type: 'square', color: "F7DC6F" }))
  ];
  

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    // Calculate the coordinates of the label's position
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    // Render a smaller label if needed
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10} // Smaller font size
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="chart-container">
    <h3 className="chart-title">Issue Types</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
              {/* Sub Pie */}
              <Pie
                data={subData}
                dataKey="value"
                nameKey="name"
                innerRadius={100}
                outerRadius={140}
                fill="#82ca9d"
                label={renderCustomizedLabel}
              >
                {subData.map((entry, index) => (
                  <Cell key={`cell-sub-${index}`} fill={COLORS_SUB[index % COLORS_SUB.length]} />
                ))}
              </Pie>
              {/* Main Pie */}
              <Pie
                data={mainData}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                fill="#8884d8"
                label={renderCustomizedLabel}
              >
                {mainData.map((entry, index) => (
                  <Cell key={`cell-main-${index}`} fill={COLORS_MAIN[index % COLORS_MAIN.length]} />
                ))}
              </Pie>
              <Tooltip />
              
            </PieChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};
export default IssueTypeDonutChart;
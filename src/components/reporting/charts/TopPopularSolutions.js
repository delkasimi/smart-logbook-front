import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const TopPopularSolutions = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Top Used Solutions</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="issue"
            type="category"
            width={120}
            style={{ fontSize: "10px" }}
          />
          <Tooltip />
          <Bar dataKey="usage" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPopularSolutions;

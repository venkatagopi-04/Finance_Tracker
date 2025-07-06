// PieChart.jsx - Pie chart for visualizing expenses by category
// Uses recharts for rendering the chart

import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

// data prop: [{ name: 'Food', value: 900 }, ...]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#AA66CC'];


const PieChartComponent = ({ data = [] }) => (
  <div>
    <h4>Expenses by Category</h4>
    {/* Pie chart visualization */}
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {/* Color each slice with a different color */}
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
);

export default PieChartComponent;

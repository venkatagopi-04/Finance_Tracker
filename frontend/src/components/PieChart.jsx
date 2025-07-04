import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Food', value: 900 },
  { name: 'Travel', value: 700 },
  { name: 'Shopping', value: 1100 },
  { name: 'Other', value: 800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#AA66CC'];

const PieChartComponent = () => (
  <div>
    <h4>Expenses by Category</h4>
    <PieChart width={300} height={250}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label
      >
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

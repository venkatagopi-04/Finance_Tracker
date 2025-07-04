import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', amount: 600 },
  { month: 'Feb', amount: 900 },
  { month: 'Mar', amount: 700 },
  { month: 'Apr', amount: 1100 },
  { month: 'May', amount: 1600 },
];

const LineChartComponent = () => (
  <div>
    <h4>Expenses Over Time</h4>
    <LineChart width={300} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
    </LineChart>
  </div>
);

export default LineChartComponent;

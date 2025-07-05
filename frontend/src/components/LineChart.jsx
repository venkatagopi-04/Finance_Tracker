import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// data prop: [{ month: 'Jan', amount: 600 }, ...]


const LineChartComponent = ({ data = [] }) => (
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

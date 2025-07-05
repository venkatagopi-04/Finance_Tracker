
import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import './SummaryGraphs.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#AA66CC', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

const SummaryGraphs = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Income vs Expense over time (by month)
  const monthly = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
    if (t.amount > 0) monthly[month].income += t.amount;
    else monthly[month].expense += Math.abs(t.amount);
  });
  const monthlyData = Object.values(monthly).sort((a, b) => new Date('20'+a.month.split(' ')[1], new Date(a.month.split(' ')[0]+" 1").getMonth()) - new Date('20'+b.month.split(' ')[1], new Date(b.month.split(' ')[0]+" 1").getMonth()));

  // 2. Expense by Category (Pie)
  const categoryMap = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // 3. Top Categories (Bar)
  const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 5);

  // 4. Payment Method Distribution (Pie)
  const paymentMap = {};
  transactions.forEach(t => {
    paymentMap[t.paymentMethod] = (paymentMap[t.paymentMethod] || 0) + 1;
  });
  const paymentData = Object.entries(paymentMap).map(([name, value]) => ({ name, value }));

  // 5. Status Distribution (Pie)
  const statusMap = {};
  transactions.forEach(t => {
    statusMap[t.status] = (statusMap[t.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // 6. Activity Heatmap (days x months)
  const heatmap = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const day = d.getDate();
    if (!heatmap[month]) heatmap[month] = {};
    heatmap[month][day] = (heatmap[month][day] || 0) + 1;
  });
  const months = Object.keys(heatmap);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="summary-graphs-container">
      <div className="summary-graphs-title">Summary & Analytics</div>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <>
          <div className="summary-graphs-flex">
            {/* Income vs Expense LineChart */}
            <div className="summary-graphs-box">
              <h4>Income vs Expense (Monthly)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#FF6384" name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense by Category PieChart */}
            <div className="summary-graphs-box">
              <h4>Expense by Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {categoryData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Categories BarChart */}
            <div className="summary-graphs-box">
              <h4>Top 5 Expense Categories</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCategories} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FFBB28">
                    {topCategories.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Method PieChart */}
            <div className="summary-graphs-box">
              <h4>Payment Method Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {paymentData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status PieChart */}
            <div className="summary-graphs-box">
              <h4>Status Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="summary-graphs-heatmap">
            <div className="summary-graphs-heatmap-title">Activity Heatmap (Days x Months)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', gap: 2, fontWeight: 'bold' }}>
                <div style={{ width: 40 }}></div>
                {days.map(day => <div key={day} style={{ width: 18, textAlign: 'center', fontSize: 10 }}>{day}</div>)}
              </div>
              {months.map(month => (
                <div key={month} style={{ display: 'flex', gap: 2 }}>
                  <div style={{ width: 40, fontWeight: 'bold', fontSize: 12 }}>{month}</div>
                  {days.map(day => {
                    const count = heatmap[month][day] || 0;
                    const color = count === 0 ? '#eee' : `rgba(30, 144, 255, ${Math.min(0.15 + count * 0.15, 1)})`;
                    return <div key={day} style={{ width: 18, height: 18, background: color, borderRadius: 3, border: '1px solid #ccc' }} title={count ? `${count} txns` : ''}></div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryGraphs;

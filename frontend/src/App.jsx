import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { CarFront, Bike, Zap, Droplets, CalendarDays } from 'lucide-react';
import './index.css';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#2dd4bf'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value.toLocaleString()}</div>
      </div>
      <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '12px', backdropFilter: 'blur(20px)' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></div>
            {entry.name}: {entry.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: '#60a5fa' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>Loading Vahan Data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Vahan Analytics</h1>
          <p className="dashboard-subtitle">India's vehicle registration insights at a glance.</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarDays size={18} color="#94a3b8" />
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Updated: June 2024</span>
        </div>
      </header>

      <div className="summary-grid">
        <StatCard title="Total Vehicles (YTD)" value={data.summary.total_vehicles} icon={CarFront} color="#60a5fa" />
        <StatCard title="Total EV Registrations" value={data.summary.total_ev} icon={Zap} color="#34d399" />
        <StatCard title="Cars Registered" value={data.summary.total_cars} icon={CarFront} color="#fbbf24" />
        <StatCard title="2-Wheelers Registered" value={data.summary.total_2w} icon={Bike} color="#c084fc" />
      </div>

      <div className="charts-grid">
        <div className="glass-panel">
          <h2 className="chart-title">Yearly Trends (Cars vs 2-Wheelers)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yearlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Bar dataKey="TwoWheeler" name="2-Wheelers" fill="#c084fc" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cars" name="Cars" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="chart-title">Monthly Trends 2024 (By Fuel Type)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends_2024} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="EV" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Petrol" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Diesel" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-panel">
          <h2 className="chart-title">Market Share (Cars)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.marketShare.Cars}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.marketShare.Cars.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="chart-title">Market Share (2-Wheelers)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.marketShare.TwoWheeler}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.marketShare.TwoWheeler.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;

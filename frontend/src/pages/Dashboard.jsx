import { useEffect, useState } from 'react';
import api, { dataOf, friendlyError } from '../services/api';
import StatCard from '../components/StatCard';
import Notice from '../components/Notice';
import { Link } from 'react-router-dom';
export default function Dashboard() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/dashboard').then(dataOf).then(setStats).catch(e => setError(friendlyError(e))); }, []);
  return <><div className="page-head"><div><div className="eyebrow">LIVE OPERATIONS</div><h1>Overview</h1><p>Welcome to your hotel management workspace.</p></div><Link className="btn btn-primary" to="/reservations">+ New reservation</Link></div><Notice error={error}/>
    <div className="stats-grid"><StatCard label="Total rooms" value={stats?.totalRooms ?? '—'} symbol="▣"/><StatCard label="Available rooms" value={stats?.availableRooms ?? '—'} symbol="✓"/><StatCard label="Occupied rooms" value={stats?.occupiedRooms ?? '—'} symbol="◈"/><StatCard label="Customers" value={stats?.totalCustomers ?? '—'} symbol="♙"/><StatCard label="Reservations" value={stats?.totalReservations ?? '—'} symbol="▤"/><StatCard label="Revenue collected" value={stats ? stats.totalRevenue.toFixed(2) : '—'} sub="Total recorded payments" symbol="¤"/></div>
    <div className="split-grid"><div className="panel"><h3>Hotel operations</h3><p className="muted">Each module uses the same MongoDB database through the Express API.</p><div className="process-list">{[['01','Register a guest','/customers'],['02','Manage available rooms','/rooms'],['03','Create a reservation','/reservations'],['04','Generate and settle a bill','/billing']].map(([n,label,link]) => <Link key={n} className="process-item" to={link}><span>{n}</span>{label}<b>↗</b></Link>)}</div></div><div className="panel panel-dark"><div className="eyebrow">INTEGRATED WORKFLOW</div><h3>One connected system</h3><p>Customers are linked to reservations. Reservations reference rooms, and bills are generated from confirmed room rates and dates.</p><div className="flow-steps">Customer <span>→</span> Room <span>→</span> Reservation <span>→</span> Bill</div></div></div>
  </>;
}

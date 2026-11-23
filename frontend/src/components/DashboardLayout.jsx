import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const items = [ ['Dashboard','/'], ['Reservations','/reservations'], ['Rooms','/rooms'], ['Customers','/customers'], ['Billing','/billing'] ];
export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">H</span><div><strong>HOTEL ERP</strong><small>MANAGEMENT CONSOLE</small></div></div>
      <div className="nav-section-label">WORKSPACE</div>
      <nav className="sidebar-nav">{items.map(([label, href],index) => <NavLink key={href} to={href} end={href === '/'} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-icon">{['▦','▤','▣','♙','◈'][index]}</span>{label}</NavLink>)}</nav>
      <div className="sidebar-foot"><div className="user-avatar">{(user?.fullName || 'U').slice(0,1).toUpperCase()}</div><div className="sidebar-user"><strong>{user?.fullName}</strong><small>{user?.role}</small></div><button className="icon-button" title="Log out" onClick={() => { signOut(); navigate('/login'); }}>↪</button></div>
    </aside>
    <main className="main"><header className="topbar"><span>Hotel ERP / Operations</span><span className="topbar-right">University ERP Prototype <span className="online-dot" /></span></header><div className="main-inner"><Outlet /></div><footer className="site-footer">Hotel ERP • React + Express + MongoDB Atlas • Assignment prototype</footer></main>
  </div>;
}

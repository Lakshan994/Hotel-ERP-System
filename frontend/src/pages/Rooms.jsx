import { useEffect, useState } from 'react';
import * as service from '../services/roomService';
import { friendlyError } from '../services/api';
import Notice from '../components/Notice';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
const blank = { roomNumber: '', roomType: 'Single', pricePerNight: '', capacity: '2', status: 'Available', description: '' };
export default function Rooms() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null);
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  async function load() { try { setItems(await service.list()); } catch(e) { setError(friendlyError(e)); } }
  useEffect(() => { load(); }, []);
  function startEdit(item) { setForm({ ...item, pricePerNight: String(item.pricePerNight), capacity: String(item.capacity) }); setEditing(item._id); window.scrollTo({top:0,behavior:'smooth'}); }
  function clear() { setForm(blank); setEditing(null); }
  async function submit(e) {
    e.preventDefault(); setError('');setSuccess('');setBusy(true);
    const payload = { ...form, pricePerNight: Number(form.pricePerNight), capacity: Number(form.capacity) };
    try { if (editing) await service.update(editing,payload); else await service.create(payload); clear(); setSuccess(editing?'Room updated':'Room created'); await load(); }
    catch(err) { setError(friendlyError(err)); } finally { setBusy(false); }
  }
  async function remove(id) { if (!window.confirm('Delete this room? This is blocked when reservations exist.')) return; setError(''); try { await service.remove(id); await load(); } catch(e) { setError(friendlyError(e)); } }
  return <><div className="page-head"><div><div className="eyebrow">ROOM MANAGEMENT</div><h1>Rooms</h1><p>Manage room inventory, room types, and operational status.</p></div><span className="count-pill">{items.length} rooms</span></div><Notice error={error} success={success}/>
    <div className="panel"><h3>{editing?'Edit room':'Add a room'}</h3><form onSubmit={submit} className="form-grid"><label>Room number<input required value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} placeholder="101" /></label><label>Room type<select value={form.roomType} onChange={e=>setForm({...form,roomType:e.target.value})}>{['Single','Double','Deluxe','Suite'].map(x=><option key={x}>{x}</option>)}</select></label><label>Price per night<input required min="0" type="number" step="0.01" value={form.pricePerNight} onChange={e=>setForm({...form,pricePerNight:e.target.value})} placeholder="15000" /></label><label>Capacity<input required min="1" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/></label><label>Room status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['Available','Occupied','Maintenance'].map(x=><option key={x}>{x}</option>)}</select></label><label>Notes<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Optional notes"/></label><div className="form-actions"><button className="btn btn-primary" disabled={busy}>{busy?'Saving…':editing?'Save changes':'Add room'}</button>{editing && <button className="btn" type="button" onClick={clear}>Cancel edit</button>}</div></form></div>
    <div className="panel table-panel"><div className="table-title"><h3>Room inventory</h3><small>Current hotel rooms</small></div><div className="table-scroll"><table><thead><tr><th>Room</th><th>Type</th><th>Nightly rate</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(room=><tr key={room._id}><td><strong>#{room.roomNumber}</strong></td><td>{room.roomType}</td><td>{Number(room.pricePerNight).toFixed(2)}</td><td>{room.capacity} guests</td><td><StatusBadge value={room.status}/></td><td><div className="row-actions"><button onClick={()=>startEdit(room)}>Edit</button>{user?.role==='Admin'&&<button className="danger-link" onClick={()=>remove(room._id)}>Delete</button>}</div></td></tr>)}{!items.length&&<tr><td colSpan="6" className="empty">No rooms yet. Add the first room above.</td></tr>}</tbody></table></div></div>
  </>;
}

import { useEffect, useState } from 'react';
import * as service from '../services/customerService';
import { friendlyError } from '../services/api';
import Notice from '../components/Notice';
import { useAuth } from '../context/AuthContext';
const blank = { firstName:'', lastName:'', email:'', phone:'', address:'' };
export default function Customers() {
  const [items,setItems] = useState([]); const [form,setForm] = useState(blank); const [editing,setEditing] = useState(null);
  const [error,setError] = useState(''); const [success,setSuccess] = useState(''); const [search,setSearch] = useState('');
  const { user } = useAuth();
  async function load(){try{setItems(await service.list());}catch(e){setError(friendlyError(e));}}
  useEffect(()=>{load();},[]);
  async function submit(e){e.preventDefault();setError('');setSuccess('');try{if(editing)await service.update(editing,form);else await service.create(form);setSuccess(editing?'Customer updated':'Customer created');setForm(blank);setEditing(null);await load();}catch(e){setError(friendlyError(e));}}
  function startEdit(x){setEditing(x._id);setForm({firstName:x.firstName,lastName:x.lastName,email:x.email||'',phone:x.phone,address:x.address||''});window.scrollTo({top:0,behavior:'smooth'});}
  async function remove(id){if(!window.confirm('Delete customer? Customers with reservations cannot be deleted.'))return;setError('');try{await service.remove(id);await load();}catch(e){setError(friendlyError(e));}}
  const filtered=items.filter(x=>`${x.firstName} ${x.lastName} ${x.phone} ${x.email}`.toLowerCase().includes(search.toLowerCase()));
  return <><div className="page-head"><div><div className="eyebrow">CUSTOMER MANAGEMENT</div><h1>Customers</h1><p>Maintain one centralized guest directory.</p></div><span className="count-pill">{items.length} customers</span></div><Notice error={error} success={success}/>
    <div className="panel"><h3>{editing?'Edit customer':'Add a customer'}</h3><form className="form-grid" onSubmit={submit}>{[['First name','firstName'],['Last name','lastName'],['Email','email'],['Phone','phone'],['Address','address']].map(([label,key])=><label key={key}>{label}<input required={['firstName','lastName','phone'].includes(key)} type={key==='email'?'email':'text'} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<div className="form-actions"><button className="btn btn-primary">{editing?'Save changes':'Add customer'}</button>{editing&&<button type="button" className="btn" onClick={()=>{setForm(blank);setEditing(null);}}>Cancel edit</button>}</div></form></div>
    <div className="panel table-panel"><div className="table-title"><h3>Guest directory</h3><input placeholder="Search guests…" value={search} onChange={e=>setSearch(e.target.value)} className="search-input"/></div><div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead><tbody>{filtered.map(x=><tr key={x._id}><td><strong>{x.firstName} {x.lastName}</strong></td><td>{x.email||'—'}</td><td>{x.phone}</td><td>{x.address||'—'}</td><td><div className="row-actions"><button onClick={()=>startEdit(x)}>Edit</button>{user?.role==='Admin'&&<button className="danger-link" onClick={()=>remove(x._id)}>Delete</button>}</div></td></tr>)}{!filtered.length&&<tr><td colSpan="5" className="empty">No matching customers.</td></tr>}</tbody></table></div></div>
  </>;
}

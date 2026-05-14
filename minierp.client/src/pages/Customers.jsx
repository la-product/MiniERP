import { useEffect, useState } from 'react';
import { getCustomers, addCustomer } from '../services/customerService';

function Customers({ view }) {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', street: '', city: '', zip: '', phone: '' });
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(true);

 

    useEffect(() => {
        getCustomers().then(data => {
            setCustomers(data);
            setLoading(false);
        });
    }, []);

    const handleEdit = (customer) => {
        setEditForm({ ...customer });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        await fetch(`/api/customer/${editForm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });

        setCustomers(prev => prev.map(c => c.id === editForm.id ? editForm : c));
        setShowModal(false);
    };

    function handleSubmit() {
        addCustomer(form).then(newCustomer => {
            setCustomers([...customers, newCustomer]);
            setForm({ name: '', email: '', street: '', city: '', zip: '', phone: '' });
        });
    }

    if (view === 'add') {
        return (
            <div>
                <h4 className="mb-4">Add Customer</h4>
                <div className="card" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Name"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Email"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Phone"
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Address"
                                    value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="City"
                                    value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="ZIP Code"
                                    value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                            Add Customer
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <div>
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input className="form-control"
                                            value={editForm.name || ''}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email</label>
                                        <input className="form-control"
                                            value={editForm.email || ''}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Phone</label>
                                        <input className="form-control"
                                            value={editForm.phone || ''}
                                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Address</label>
                                        <input className="form-control"
                                            value={editForm.street || ''}
                                            onChange={e => setEditForm({ ...editForm, street: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">City</label>
                                        <input className="form-control"
                                            value={editForm.city || ''}
                                            onChange={e => setEditForm({ ...editForm, city: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">ZIP Code</label>
                                        <input className="form-control"
                                            value={editForm.zip || ''}
                                            onChange={e => setEditForm({ ...editForm, zip: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <h4 className="mb-4">Customer List</h4>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>ZIP Code</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.street}</td>
                            <td>{c.city}</td>
                            <td>{c.zip}</td>
                            <td>{c.phone}</td>
                            <td>
                               
                                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(c)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Customers;
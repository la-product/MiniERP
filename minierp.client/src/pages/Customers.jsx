import { useEffect, useState } from 'react';
import { getCustomers, addCustomer } from '../services/customerService';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '',street: '', city: '', zip:'', phone: '' });

    useEffect(() => {
        getCustomers().then(data => setCustomers(data));
    }, []);

    function handleSubmit() {
        addCustomer(form).then(newCustomer => {
            setCustomers([...customers, newCustomer]);
            setForm({ name: '', email: '', street: '', city: '', zip: '', phone: '' });
        });
    }

    return (
        <div>
            <h4 className="mb-4">Zákazníci</h4>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Přidat zákazníka</h5>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Jméno"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Ulice"
                                value={form.street}
                                onChange={e => setForm({ ...form, street: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Město"
                                value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="PSČ"
                                value={form.zip}
                                onChange={e => setForm({ ...form, zip: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Telefon"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                        Přidat
                    </button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Jméno</th>
                        <th>Email</th>
                        <th>Ulice</th>
                        <th>Město</th>
                        <th>PSČ</th>
                        <th>Telefon</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Customers;
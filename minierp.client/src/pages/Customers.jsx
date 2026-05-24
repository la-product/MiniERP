import { useCallback, useEffect, useState } from "react";
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from "../services/customerService";
import {
    mapCustomerDtoToForm
} from "../mappers/customerMapper";

function Customers({ view }) {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        street: "",
        city: "",
        zip: "",
        phone: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCustomers = useCallback(async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCustomers();
    }, [loadCustomers]);

    const handleEdit = (customer) => {
        setEditForm(mapCustomerDtoToForm(customer));
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const updated = await updateCustomer(editForm.id, editForm);
            setCustomers((prev) =>
                prev.map((c) => (c.id === editForm.id ? updated : c)),
            );
            setShowModal(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Opravdu chcete smazat tohoto zákazníka?")) {
            try {
                await deleteCustomer(id);
                setCustomers((prev) => prev.filter((c) => c.id !== id));
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const newCustomer = await addCustomer(form);
            setCustomers([...customers, newCustomer]);
            setForm({
                name: "",
                email: "",
                street: "",
                city: "",
                zip: "",
                phone: "",
            });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (view === "add") {
        return (
            <div>
                <h4 className="mb-4">Add Customer</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="card" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="Address"
                                    value={form.street}
                                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="City"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    className="form-control"
                                    placeholder="ZIP Code"
                                    value={form.zip}
                                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                />
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
            {error && <div className="alert alert-danger">{error}</div>}
            {showModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input
                                            className="form-control"
                                            value={editForm.name || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email</label>
                                        <input
                                            className="form-control"
                                            value={editForm.email || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, email: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Phone</label>
                                        <input
                                            className="form-control"
                                            value={editForm.phone || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, phone: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Address</label>
                                        <input
                                            className="form-control"
                                            value={editForm.street || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, street: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">City</label>
                                        <input
                                            className="form-control"
                                            value={editForm.city || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, city: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">ZIP Code</label>
                                        <input
                                            className="form-control"
                                            value={editForm.zip || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, zip: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.city}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => handleEdit(customer)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleDelete(customer.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Customers;

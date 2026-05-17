import { useState } from 'react';
import { addProduct } from '../services/productService';

function Products({ view, products, setProducts, loading }) {
    const [form, setForm] = useState({ size: '', brand: '', pattern: '', si: '', li: '', netPrice: '', stock: '' });
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({});

    const handleEdit = (product) => {
        setEditForm({ ...product });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        await fetch(`/api/products/${editForm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });
        setProducts(prev => prev.map(p => p.id === editForm.id ? editForm : p));
        setShowModal(false);
    };

    const handleSubmit = () => {
        addProduct(form).then(newProduct => {
            setProducts(prev => [...prev, newProduct]);
            setForm({ size: '', brand: '', pattern: '', si: '', li: '', netPrice: '', stock: '' });
        });
    };





    if (view == "add") {
        return (
            <div>
                <h4 className="mb-4">Add Product</h4>
                <div className="card" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Size"
                                    value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Brand"
                                    value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Pattern"
                                    value={form.pattern} onChange={e => setForm({ ...form, pattern: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Si"
                                    value={form.si} onChange={e => setForm({ ...form, si: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Li"
                                    value={form.li} onChange={e => setForm({ ...form, li: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="NetPrice"
                                    value={form.netPrice} onChange={e => setForm({ ...form, netPrice: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <input className="form-control" placeholder="Stock"
                                    value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                            Add Product
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
                                <h5 className="modal-title">Edit Product</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Size</label>
                                        <input className="form-control"
                                            value={editForm.size || ''}
                                            onChange={e => setEditForm({ ...editForm, size: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Brand</label>
                                        <input className="form-control"
                                            value={editForm.brand || ''}
                                            onChange={e => setEditForm({ ...editForm, brand: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Pattern</label>
                                        <input className="form-control"
                                            value={editForm.pattern || ''}
                                            onChange={e => setEditForm({ ...editForm, pattern: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Si</label>
                                        <input className="form-control"
                                            value={editForm.si || ''}
                                            onChange={e => setEditForm({ ...editForm, si: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Li</label>
                                        <input className="form-control"
                                            value={editForm.li || ''}
                                            onChange={e => setEditForm({ ...editForm, li: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Net Price</label>
                                        <input className="form-control"
                                            value={editForm.netPrice || ''}
                                            onChange={e => setEditForm({ ...editForm, netPrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Stock</label>
                                        <input className="form-control"
                                            value={editForm.stock || ''}
                                            onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
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
            <h4>Products</h4>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Size</th>
                        <th>Brand</th>
                        <th>Pattern</th>
                        <th>SI</th>
                        <th>LI</th>
                        <th>NetPrice</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{products.map(p =>
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td> {p.size}</td>
                        <td>{p.brand}</td>
                        <td>{p.pattern}</td>
                        <td>{p.si}</td>
                        <td>{p.li}</td>
                        <td>{p.netPrice}</td>
                        <td className="text-success fw-bold">{p.stock}</td>
                        <td>

                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(p)}>Edit</button>
                        </td>

                    </tr>
                )}
                </tbody>

            </table>
        </div>
    );
}


export default Products;
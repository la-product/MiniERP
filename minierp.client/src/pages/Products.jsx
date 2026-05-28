import { useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { mapProductDtoToForm, getProductDisplayText } from '../mappers/productMapper';

function Products({ view, products, setProducts, loading, setLoading }) {
    const [form, setForm] = useState({ size: '', brand: '', pattern: '', si: '', li: '', netPrice: '', stock: '' });
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState(null);

    const loadProducts = useCallback(async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setProducts]);

    useEffect(() => {
        if (!products) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadProducts();
        }
    }, [loadProducts, products]);

    const handleEdit = (product) => {
        setEditForm(mapProductDtoToForm(product));
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const updated = await updateProduct(editForm.id, editForm);
            setProducts(prev => prev.map(p => p.id === editForm.id ? updated : p));
            setShowModal(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Opravdu chcete smazat tento produkt?')) {
            try {
                await deleteProduct(id);
                setProducts(prev => prev.filter(p => p.id !== id));
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const newProduct = await addProduct(form);
            setProducts(prev => [...prev, newProduct]);
            setForm({ size: '', brand: '', pattern: '', si: '', li: '', netPrice: '', stock: '' });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (view == "add") {
        return (
            <div>
                <h4 className="mb-4">Add Product</h4>
                {error && <div className="alert alert-danger">{error}</div>}
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
            {error && <div className="alert alert-danger">{error}</div>}
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
                                        <input className="form-control" value={editForm.size || ''}
                                            onChange={e => setEditForm({ ...editForm, size: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Brand</label>
                                        <input className="form-control" value={editForm.brand || ''}
                                            onChange={e => setEditForm({ ...editForm, brand: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Pattern</label>
                                        <input className="form-control" value={editForm.pattern || ''}
                                            onChange={e => setEditForm({ ...editForm, pattern: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Si</label>
                                        <input className="form-control" value={editForm.si || ''}
                                            onChange={e => setEditForm({ ...editForm, si: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Li</label>
                                        <input className="form-control" value={editForm.li || ''}
                                            onChange={e => setEditForm({ ...editForm, li: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">NetPrice</label>
                                        <input className="form-control" value={editForm.netPrice || ''}
                                            onChange={e => setEditForm({ ...editForm, netPrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Stock</label>
                                        <input className="form-control" value={editForm.stock || ''}
                                            onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
            <h4>Product list</h4>
            <div className="table-responsive rounded overflow-hidden">
                <table className="table table-hover table-sm table-striped table-light mb-0">
                    <thead className="table-secondary">
                        <tr>
                            <th>Size</th>
                            <th>SI/LI</th>
                            <th>NetPrice</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map(product => (
                            <tr key={product.id}>
                                <td>{getProductDisplayText(product)}</td>
                                <td>{product.si}{product.li}</td>
                                <td className="fw-bold">{product.netPrice}</td>
                                <td className="text-success fw-bold">{product.stock}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning"
                                        onClick={() => handleEdit(product)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleDelete(product.id)}>
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

export default Products;

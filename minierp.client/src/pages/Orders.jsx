import { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getOrders, createOrder, updateOrderStatus } from "../services/orderService";

function Orders({ view, products, setProducts }) {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        customerId: '',
        street: '',
        city: '',
        zip: '',
        shipping: 'courier',
        payment: 'card'
    });
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        brand: '',
        quantity: 1
    });

    const changeStatusColor = (status) => {
        switch (status) {
            case "New": return "bg-danger text-white";
            case "Processing": return "bg-warning text-dark";
            case "Shipped": return "bg-primary";
            case "Completed": return "bg-success";
            default: return "bg-secondary";
        }
    };

    useEffect(() => {
        getCustomers().then(data => setCustomers(data));
        getOrders().then(data => setOrders(data));
    }, []);

    const handleCustomerInput = (e) => {
        const name = e.target.value;
        const match = customers.find(c => c.name === name);
        if (match) {
            setForm({ ...form, customerId: match.id, street: match.street, city: match.city, zip: match.zip });
        } else {
            setForm({ ...form, customerId: '', street: '', city: '', zip: '' });
        }
    };
    
    const handleAddProduct = () => {
        if (!currentItem.brand) return;
        const product = products.find(
            p => `${p.size} ${p.brand} ${p.pattern}` === currentItem.brand
        );
        if (!product) return;
        const newItem = {
            productId: product.id,
            brand: `${product.size} ${product.brand} ${product.pattern}`,
            quantity: currentItem.quantity,
            unitPrice: product.netPrice,
            totalPrice: product.netPrice * currentItem.quantity
        };
        setItems([...items, newItem]);
        setCurrentItem({ brand: '', quantity: 1 });
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleCreateOrder = async () => {
        if (!form.customerId) { alert("Select customer"); return; }
        if (items.length === 0) { alert("Add products"); return; }

        const orderPayload = {
            customerId: form.customerId,
            shipping: `${form.street}, ${form.city}, ${form.zip}`,
            payment: form.payment,
            totalPrice: items.reduce((sum, item) => sum + item.totalPrice, 0),
            status: "New",
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            }))
        };
        console.log("orderPayload:", orderPayload);

        await createOrder(orderPayload);

        getOrders().then(data => setOrders(data));
        getProducts().then(data => setProducts(data));

        setItems([]);
        setForm({ customerId: '', street: '', city: '', zip: '', shipping: 'courier', payment: 'card' });
        setCurrentItem({ brand: '', quantity: 1 });
    };

    const handleOpenOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleChangeStatus = async () => {
        const statuses = ["New", "Processing", "Shipped", "Completed"];
        const currentIndex = statuses.indexOf(selectedOrder.status);
        if (currentIndex === -1 || currentIndex === statuses.length - 1) return;

        const updatedStatus = statuses[currentIndex + 1];

        await updateOrderStatus(selectedOrder.id, updatedStatus);

        getOrders().then(data => setOrders(data));
        setSelectedOrder({ ...selectedOrder, status: updatedStatus });
    };

    if (view === "add") {
        return (
            <div>
                <h4 className="mb-4">New Order</h4>
                <div className="card" style={{ maxWidth: 700 }}>
                    <div className="card-body">
                        {/* Customer */}
                        <h6 className="text-muted mb-2">Customer</h6>
                        <div className="row g-2 mb-3">
                            <div className="col-12">
                                <input
                                    className="form-control"
                                    placeholder="— Search customer —"
                                    list="customer-list"
                                    onChange={handleCustomerInput}
                                />
                                <datalist id="customer-list">
                                    {customers.map(c => (
                                        <option key={c.id} value={c.name} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        {/* Shipping */}
                        <h6 className="text-muted mb-2">Shipping</h6>
                        <div className="row g-2 mb-3">
                            <div className="col-12">
                                <input
                                    className="form-control"
                                    placeholder="Address"
                                    value={form.street}
                                    onChange={e => setForm({ ...form, street: e.target.value })}
                                />
                            </div>
                            <div className="col-md-8">
                                <input
                                    className="form-control"
                                    placeholder="City"
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="ZIP"
                                    value={form.zip}
                                    onChange={e => setForm({ ...form, zip: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-select"
                                    value={form.shipping}
                                    onChange={e => setForm({ ...form, shipping: e.target.value })}
                                >
                                    <option value="courier">Courier</option>
                                    <option value="packeta">Zásilkovna</option>
                                    <option value="personal">Personal pickup</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-select"
                                    value={form.payment}
                                    onChange={e => setForm({ ...form, payment: e.target.value })}
                                >
                                    <option value="card">Card</option>
                                    <option value="transfer">Bank transfer</option>
                                    <option value="cash">Cash on delivery</option>
                                </select>
                            </div>
                        </div>
                        {/* Items */}
                        <h6 className="text-muted mb-2">Items</h6>
                        <div className="row g-2 mb-3">
                            <div className="col-md-8">
                                <input
                                    className="form-control"
                                    placeholder="— Search product —"
                                    list="product-list"
                                    value={currentItem.brand}
                                    onChange={e => setCurrentItem({ ...currentItem, brand: e.target.value })}
                                />
                                <datalist id="product-list">
                                    {products.map(p => (
                                        <option key={p.id} value={`${p.size} ${p.brand} ${p.pattern}`} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="col-md-2">
                                <input
                                    className="form-control"
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    value={currentItem.quantity}
                                    onChange={e => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={handleAddProduct}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        {/* Items list */}
                        {items.length > 0 && (
                            <table className="table table-sm mt-2">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.brand}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.totalPrice.toFixed(2)} CZK</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Note */}
                        <h6 className="text-muted mb-2">Note</h6>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows={2}
                                placeholder="Note (optional)"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreateOrder}
                        >
                            Create Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h4 className="mb-4">List of Orders</h4>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Created At</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer?.name ?? order.customerName}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{order.totalPrice.toFixed(2)} CZK</td>
                            <td>
                                <span className={`badge rounded-pill ${changeStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleOpenOrder(order)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal okno */}
            {showModal && selectedOrder && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order #{selectedOrder.id}</h5>
                                <button className="btn-close" onClick={handleCloseModal} />
                            </div>
                            <div className="modal-body">
                                <h6>Customer</h6>
                                <p className="mb-1">{selectedOrder.customer?.name}</p>
                                <p className="text-muted">{selectedOrder.shipping}</p>
                                <hr />
                                <h6>Items</h6>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.product?.brand ?? item.brand}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.unitPrice * item.quantity).toFixed(2)} CZK</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="text-end mt-3">
                                    <strong>Total: {selectedOrder.totalPrice.toFixed(2)} CZK</strong>
                                </div>
                                <div className="mt-3">
                                    <span className={`badge rounded-pill ${changeStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleChangeStatus}>
                                    Change Status
                                </button>
                                <button className="btn btn-success">Create Invoice</button>
                                <button className="btn btn-outline-dark" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;

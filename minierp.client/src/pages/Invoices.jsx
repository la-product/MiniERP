import { useState, useCallback, useEffect } from "react";
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
} from "../services/invoiceService";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getProductDisplayText } from "../mappers/productMapper";

const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
};

const toDateInputValue = (date) => date.toISOString().split("T")[0];

const createDefaultInvoiceForm = () => {
    const issueDate = new Date();

    return {
        issueDate: toDateInputValue(issueDate),
        dueDate: toDateInputValue(addDays(issueDate, 30)),
        customerId: "",
        totalAmountExVat: 0,
        vatAmount: 0,
        totalAmountIncVat: 0,
        currencyCode: "CZK",
        status: "draft",
    };
};

const calculateInvoiceTotals = (invoiceItems) => {
    const totalAmountExVat = invoiceItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
    );
    const vatAmount = invoiceItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity * item.vatRate,
        0,
    );

    return {
        totalAmountExVat,
        vatAmount,
        totalAmountIncVat: totalAmountExVat + vatAmount,
    };
};

function Invoices({ view }) {
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(createDefaultInvoiceForm);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        productId: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 0.21,
        totalPrice: 0,
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "draft":
                return "badge-secondary-light";
            case "issued":
                return "badge-primary-light";
            case "paid":
                return "badge-success-light";
            case "overdue":
                return "badge-danger-light";
            default:
                return "bg-secondary";
        }
    };

    const loadData = useCallback(async () => {
        try {
            const [invoicesData, customersData, productsData] = await Promise.all([
                getInvoices(),
                getCustomers(),
                getProducts(),
            ]);
            setInvoices(invoicesData);
            setCustomers(customersData);
            setProducts(productsData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, [loadData]);

    const handleCustomerChange = (e) => {
        const customerId = parseInt(e.target.value);
        setForm({ ...form, customerId });
    };

    const handleAddItem = () => {
        if (!currentItem.productId) return;

        const newItem = {
            ...currentItem,
            productId: parseInt(currentItem.productId),
            quantity: parseInt(currentItem.quantity) || 1,
            unitPrice: parseFloat(currentItem.unitPrice) || 0,
            vatRate: parseFloat(currentItem.vatRate) || 0.21,
        };

        newItem.totalPrice =
            newItem.unitPrice * newItem.quantity * (1 + newItem.vatRate);
        const newItems = [...items, newItem];
        const totals = calculateInvoiceTotals(newItems);

        setItems(newItems);
        setForm({
            ...form,
            ...totals,
        });

        setCurrentItem({
            productId: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            vatRate: 0.21,
            totalPrice: 0,
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        const totals = calculateInvoiceTotals(newItems);

        setForm({
            ...form,
            ...totals,
        });
    };

    const handleCreateInvoice = async () => {
        if (!form.customerId) {
            alert("Select customer");
            return;
        }
        if (items.length === 0) {
            alert("Add items");
            return;
        }

        try {
            const invoicePayload = {
                issueDate: form.issueDate,
                dueDate: form.dueDate,
                customerId: form.customerId,
                status: form.status,
                currencyCode: form.currencyCode,
                totalAmountExVat: form.totalAmountExVat,
                vatAmount: form.vatAmount,
                totalAmountIncVat: form.totalAmountIncVat,
                items: items.map((item) => ({
                    productId: item.productId,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    vatRate: item.vatRate,
                    totalPrice: item.totalPrice,
                })),
            };

            await createInvoice(invoicePayload, items);
            await loadData();

            setForm(createDefaultInvoiceForm());
            setItems([]);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenInvoice = async (invoiceId) => {
        try {
            const invoice = await getInvoiceById(invoiceId);
            setSelectedInvoice(invoice);
            setShowModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleChangeStatus = async () => {
        const statuses = ["draft", "issued", "paid", "overdue"];
        const currentIndex = statuses.indexOf(selectedInvoice.status);
        if (currentIndex === -1 || currentIndex === statuses.length - 1) return;

        try {
            const updatedStatus = statuses[currentIndex + 1];
            await updateInvoiceStatus(selectedInvoice.id, updatedStatus);
            await loadData();
            setSelectedInvoice({ ...selectedInvoice, status: updatedStatus });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteInvoice = async (id) => {
        if (window.confirm("Opravdu chcete smazat tuto fakturu?")) {
            try {
                await deleteInvoice(id);
                await loadData();
                setShowModal(false);
                setSelectedInvoice(null);
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (view === "add") {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Create Invoice</h4>
                    <button className="btn btn-outline-secondary" onClick={() => (window.location.hash = "#/invoices")}>
                        <i className="bi bi-arrow-left me-2"></i>Back to List
                    </button>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="card border-0 shadow-sm" style={{ maxWidth: 900 }}>
                    <div className="card-body p-4">
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">Issue Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.issueDate}
                                    onChange={(e) =>
                                        setForm({ ...form, issueDate: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.dueDate}
                                    onChange={(e) =>
                                        setForm({ ...form, dueDate: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">Currency</label>
                                <select
                                    className="form-select"
                                    value={form.currencyCode}
                                    onChange={(e) =>
                                        setForm({ ...form, currencyCode: e.target.value })
                                    }
                                >
                                    <option value="CZK">CZK</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">Status</label>
                                <select
                                    className="form-select"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="issued">Issued</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Customer</label>
                            <select
                                className="form-select"
                                value={form.customerId}
                                onChange={handleCustomerChange}
                            >
                                <option value="">— Select customer —</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="border-top pt-4">
                            <h6 className="fw-bold mb-3">Invoice Items</h6>
                            <div className="row g-2 mb-3 align-items-end">
                                <div className="col-md-3">
                                    <label className="form-label small">Product</label>
                                    <select
                                        className="form-select"
                                        value={currentItem.productId}
                                        onChange={(e) => {
                                            const product = products.find(
                                                (p) => p.id === parseInt(e.target.value),
                                            );
                                            setCurrentItem({
                                                ...currentItem,
                                                productId: e.target.value,
                                                unitPrice: product?.netPrice || 0,
                                            });
                                        }}
                                    >
                                        <option value="">— Product —</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {getProductDisplayText(p)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Description"
                                        value={currentItem.description}
                                        onChange={(e) =>
                                            setCurrentItem({
                                                ...currentItem,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small">Qty</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Qty"
                                        value={currentItem.quantity}
                                        onChange={(e) =>
                                            setCurrentItem({ ...currentItem, quantity: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small">Unit Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Price"
                                        value={currentItem.unitPrice}
                                        onChange={(e) =>
                                            setCurrentItem({
                                                ...currentItem,
                                                unitPrice: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={handleAddItem}
                                    >
                                        <i className="bi bi-plus-lg me-1"></i>Add
                                    </button>
                                </div>
                            </div>

                            {items.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Description</th>
                                                <th className="text-center">Qty</th>
                                                <th className="text-end">Unit Price</th>
                                                <th className="text-end">Total</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => {
                                                const product = products.find(p => p.id === item.productId);
                                                return (
                                                    <tr key={index}>
                                                        <td>{product ? getProductDisplayText(product) : item.name}</td>
                                                        <td>{item.description}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">{item.unitPrice.toFixed(2)}</td>
                                                        <td className="text-end fw-bold">{item.totalPrice.toFixed(2)}</td>
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemoveItem(index)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6 ms-auto">
                                <div className="card bg-light border-0">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Subtotal (Ex VAT):</span>
                                            <span className="fw-bold">{form.totalAmountExVat.toFixed(2)} {form.currencyCode}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">VAT:</span>
                                            <span className="fw-bold">{form.vatAmount.toFixed(2)} {form.currencyCode}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="h6 mb-0 fw-bold">Total Amount:</span>
                                            <span className="h5 mb-0 fw-bold text-primary">{form.totalAmountIncVat.toFixed(2)} {form.currencyCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top">
                            <button
                                className="btn btn-primary btn-lg w-100 fw-bold"
                                onClick={handleCreateInvoice}
                            >
                                <i className="bi bi-check2-circle me-2"></i>Create Invoice
                            </button>
                        </div>
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">List of Invoices</h4>
                <button className="btn btn-primary" onClick={() => (window.location.hash = "#/invoices/add")}>
                    <i className="bi bi-plus-lg me-2"></i>New Invoice
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Customer</th>
                                <th>Issue Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="fw-bold text-dark">#{invoice.id}</td>
                                    <td>
                                        <div className="fw-bold text-dark">{invoice.customer?.name || "Unknown"}</div>
                                        <div className="text-muted small">{invoice.customer?.city}</div>
                                    </td>
                                    <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
                                    <td className="fw-bold text-dark">
                                        {invoice.totalAmountIncVat.toFixed(2)} {invoice.currencyCode}
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleOpenInvoice(invoice.id)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteInvoice(invoice.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedInvoice && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Invoice #{selectedInvoice.id}</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <h6>Customer</h6>
                                <table className="mb-3">
                                    <tbody>
                                        <tr>
                                            <tr>{selectedInvoice.customer?.name}</tr>
                                            <tr>{selectedInvoice.customer?.street}</tr>
                                            <tr>{selectedInvoice.customer?.city} {selectedInvoice.customer?.zip} </tr>
                                        </tr>
                                    </tbody>
                                </table>
                             

                                <h6>Items</h6>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Description</th>
                                            <th>Qty</th>
                                            <th>Unit Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoice.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.product?.brand} {item.product?.size} {item.product?.pattern}</td>
                                                <td>{item.description}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.unitPrice.toFixed(2)}</td>
                                                <td>{item.totalPrice.toFixed(2)}</td>
                                            </tr>
                                              
                                        ))}
                                    </tbody>
                                </table>

                                <div className="text-end mt-3 p-3 bg-light rounded">
                                    <div>
                                        Ex VAT:{" "}
                                        <strong>
                                            {selectedInvoice.totalAmountExVat.toFixed(2)}{" "}
                                            {selectedInvoice.currencyCode}
                                        </strong>
                                    </div>
                                    <div>
                                        VAT:{" "}
                                        <strong>
                                            {selectedInvoice.vatAmount.toFixed(2)}{" "}
                                            {selectedInvoice.currencyCode}
                                        </strong>
                                    </div>
                                    <div className="fs-5">
                                        Total:{" "}
                                        <strong>
                                            {selectedInvoice.totalAmountIncVat.toFixed(2)}{" "}
                                            {selectedInvoice.currencyCode}
                                        </strong>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <span className={`badge ${getStatusBadgeClass(selectedInvoice.status)}`}>
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleChangeStatus}
                                >
                                    <i className="bi bi-arrow-repeat me-2"></i>Change Status
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowModal(false)}
                                >
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

export default Invoices;

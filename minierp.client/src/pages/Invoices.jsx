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

  const changeStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-secondary text-white";
      case "issued":
        return "bg-info text-white";
      case "paid":
        return "bg-success text-white";
      case "overdue":
        return "bg-danger text-white";
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
        <h4 className="mb-4">Create Invoice</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card" style={{ maxWidth: 800 }}>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label">Issue Date</label>
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
                <label className="form-label">Due Date</label>
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
                <label className="form-label">Currency</label>
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
                <label className="form-label">Status</label>
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

            <h6 className="text-muted mb-2">Customer</h6>
            <div className="mb-3">
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

            <h6 className="text-muted mb-2">Items</h6>
            <div className="row g-2 mb-2">
              <div className="col-md-3">
                <select
                  className="form-select form-select-sm"
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
                <input
                  type="text"
                  className="form-control form-control-sm"
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
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Qty"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, quantity: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
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
                  className="btn btn-sm btn-outline-primary w-100"
                  onClick={handleAddItem}
                >
                  Add
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <table className="table table-sm mt-3">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toFixed(2)}</td>
                      <td>{item.totalPrice.toFixed(2)}</td>
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

            <div className="text-end mt-3 p-3 bg-light rounded">
              <div>
                Ex VAT:{" "}
                <strong>
                  {form.totalAmountExVat.toFixed(2)} {form.currencyCode}
                </strong>
              </div>
              <div>
                VAT:{" "}
                <strong>
                  {form.vatAmount.toFixed(2)} {form.currencyCode}
                </strong>
              </div>
              <div className="fs-5">
                Total:{" "}
                <strong>
                  {form.totalAmountIncVat.toFixed(2)} {form.currencyCode}
                </strong>
              </div>
            </div>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={handleCreateInvoice}
            >
              Create Invoice
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
      <h4 className="mb-4">Invoices</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Customer</th>
            <th>Issue Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>#{invoice.id}</td>
              <td>{invoice.customer?.name || "Unknown"}</td>
              <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
              <td>
                {invoice.totalAmountIncVat.toFixed(2)} {invoice.currencyCode}
              </td>
              <td>
                <span
                  className={`badge rounded-pill ${changeStatusColor(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => handleOpenInvoice(invoice.id)}
                >
                  View
                </button>
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleDeleteInvoice(invoice.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                <p className="mb-3">{selectedInvoice.customer?.name}</p>

                <h6>Items</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
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
                  <span
                    className={`badge rounded-pill ${changeStatusColor(selectedInvoice.status)}`}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleChangeStatus}
                >
                  Change Status
                </button>
                <button
                  className="btn btn-outline-dark"
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

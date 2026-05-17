export const getOrders = async () => {
    const res = await fetch('/api/orders');
    return res.json();
};

export const createOrder = async (order) => {
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
    return res.json();
};

export const updateOrderStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status)
    });
    return res.json();
};
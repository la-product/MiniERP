const API_URL = '/api/customer';

export async function getCustomers() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function addCustomer(customer) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
    return res.json();
}
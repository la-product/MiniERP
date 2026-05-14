const API_URL = '/api/products'

export async function getProducts() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function addProduct(product) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return res.json();
}
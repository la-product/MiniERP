import { useState, useEffect } from 'react';
import { getProducts } from './services/productService';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';

function App() {
    const [activePage, setActivePage] = useState('Customer list');
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        getProducts().then(data => {
            setProducts(data);
            setProductsLoading(false);
        });
    }, []);

    const renderPage = () => {
        switch (activePage) {
            case 'Customer list': return <Customers view="list" />;
            case 'Add customer': return <Customers view="add" />;
            case 'Product list': return <Products view="list" products={products} setProducts={setProducts} loading={productsLoading} />;
            case 'Add product': return <Products view="add" products={products} setProducts={setProducts} />;
            case 'Order list': return <Orders view="list" products={products} setProducts={setProducts} />;
            case 'Add order': return <Orders view="add" products={products} setProducts={setProducts} />;
            case 'Invoice list': return <Invoices view="list" />;
            case 'Add invoice': return <Invoices view="add" />;
            default: return null;
        }
    };

    return (
        <Layout activePage={activePage} setActivePage={setActivePage}>
            {renderPage()}
        </Layout>
    );
}

export default App;
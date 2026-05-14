import { useState } from 'react';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';


function App() {
    const [activePage, setActivePage] = useState('Customer list');

    const pages = {
        'Customer list': <Customers view="list" />,
        'Add customer': <Customers view="add" />,
        'Product list': <Products view="list" />,
        'Add product': <Products view="add" />,
        'Order list': <Orders view="list" />,
        'Add order': <Orders view="add" />,
        'Invoice list': <Invoices view="list" />,
        'Add invoice': <Invoices view="add" />,
    };
    return (
        <Layout activePage={activePage} setActivePage={setActivePage}>
            {pages[activePage]}
        </Layout>
    );
}

export default App;
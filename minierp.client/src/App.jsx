import { useState } from 'react';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';


function App() {
    const [activePage, setActivePage] = useState('Zákazníci');

    const pages = {
        'Zákazníci': <Customers />,
        'Produkty': <Products />,
        'Objednávky': <Orders />,
        'Faktury': <Invoices />,
    };

    return (
        <Layout activePage={activePage} setActivePage={setActivePage}>
            {pages[activePage]}
        </Layout>
    );
}

export default App;
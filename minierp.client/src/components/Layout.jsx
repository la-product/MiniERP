import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ activePage, setActivePage, children }) {
    return (
        <div className="d-flex flex-column vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <Navbar />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <main className="flex-grow-1 p-5 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
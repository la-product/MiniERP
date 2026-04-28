import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ activePage, setActivePage, children }) {
    return (
        <div className="d-flex flex-column vh-100">
            <Navbar />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <main className="flex-grow-1 p-4 overflow-auto bg-light">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
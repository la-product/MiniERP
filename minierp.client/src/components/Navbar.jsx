function Navbar() {
    return (
        <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4">
            <div className="navbar-brand mb-0 h1">
                <i className="bi bi-box-seam me-2" style={{ fontSize: '24px', color: '#996600' }}></i>
                <span className="fw-bold" style={{ color: '#1a1a1a' }}>ERPiE</span>
            </div>
            <span className="text-secondary small">v1.0.0</span>
        </nav>
    );
}

export default Navbar;
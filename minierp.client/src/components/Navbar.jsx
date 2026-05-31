function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4">
            <div className="navbar-brand mb-0 h1 d-flex align-items-center">
                <i className="bi bi-box-seam me-2" style={{ fontSize: '24px', color: '#996600' }}></i>
                <span className="fw-bold" style={{ color: '#1a1a1a' }}>ERPiE</span>
            </div>
            <div className="d-flex align-items-center">
                {user && (
                    <div className="me-3 d-flex align-items-center">
                        <i className="bi bi-person-circle me-2 text-primary" style={{ fontSize: '20px' }}></i>
                        <span className="fw-medium me-2">{user.username}</span>
                        <span className="badge bg-light text-dark border small me-3">{user.role}</span>
                        <button 
                            className="btn btn-outline-danger btn-sm d-flex align-items-center" 
                            onClick={onLogout}
                            title="Odhlásit se"
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </button>
                    </div>
                )}
                <span className="text-secondary small ms-2">v1.0.0</span>
            </div>
        </nav>
    );
}

export default Navbar;
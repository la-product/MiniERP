import { useState } from 'react';

function Users({ view }) {
    const [users, setUsers] = useState([
        { id: 1, username: 'admin', role: 'Admin' },
        { id: 2, username: 'demo', role: 'Demo' }
    ]);

    const renderList = () => (
        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white py-3 border-bottom">
                <h5 className="mb-0 fw-bold">Seznam uživatelů</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0">Uživatelské jméno</th>
                                <th className="px-4 py-3 border-0">Role</th>
                                <th className="px-4 py-3 border-0 text-end">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="px-4 py-3 align-middle">{u.username}</td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className={`badge ${u.role === 'Admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-end">
                                        <button className="btn btn-sm btn-outline-secondary me-2">
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderAdd = () => (
        <div className="card shadow-sm border-0 rounded-3" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-white py-3 border-bottom">
                <h5 className="mb-0 fw-bold">Přidat uživatele</h5>
            </div>
            <div className="card-body p-4">
                <form>
                    <div className="mb-3">
                        <label className="form-label">Uživatelské jméno</label>
                        <input type="text" className="form-control" placeholder="admin123" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Heslo</label>
                        <input type="password" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select className="form-select">
                            <option value="User">User</option>
                            <option value="Demo">Demo</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-light">Zrušit</button>
                        <button type="submit" className="btn btn-primary">Uložit uživatele</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Správa uživatelů</h2>
            </div>
            {view === 'list' ? renderList() : renderAdd()}
        </div>
    );
}

export default Users;

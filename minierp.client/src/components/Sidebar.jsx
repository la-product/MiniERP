import { useState } from 'react';

function Sidebar({ activePage, setActivePage }) {
    const [openSection, setOpenSection] = useState('');

    const menu = [
        { label: 'Customers', items: ['Customer list', 'Add customer'] },
        { label: 'Products', items: ['Product list', 'Add product'] },
        { label: 'Orders', items: ['Order list', 'Add order'] },
        { label: 'Invoices', items: ['Invoice list', 'Add invoice'] }
    ];

    return (
        <div className="bg-light border-end d-flex flex-column" style={{ width: 210 }}>
            <div className="p-3 text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                MENU
            </div>
            <ul className="nav flex-column px-2">
                {menu.map(section => (
                    <li key={section.label} className="nav-item mb-1">
                        <a href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenSection(openSection === section.label ? '' : section.label);
                            }}
                            className="nav-link rounded text-dark d-flex justify-content-between"
                        >
                            {section.label}
                            <span>{openSection === section.label ? '▲' : '▼'}</span>
                        </a>
                        {openSection === section.label && (
                            <ul className="nav flex-column ps-3">
                                {section.items.map(item => (
                                    <li key={item} className="nav-item">
                                        <a href="#"
                                            onClick={(e) => { e.preventDefault(); setActivePage(item); }}
                                            className={`nav-link rounded ${activePage === item ? 'bg-primary text-white' : 'text-secondary'}`}
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
function Sidebar({ activePage, setActivePage }) {
    const items = ['Zákazníci', 'Produkty', 'Objednávky', 'Faktury'];

    return (
        <div className="bg-white border-end d-flex flex-column" style={{ width: 210 }}>
            <div className="p-3 text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                MENU
            </div>
            <ul className="nav flex-column px-2">
                {items.map(item => (
                    <li key={item} className="nav-item mb-1">
                       <a href="#"
                        onClick={(e) => { e.preventDefault(); setActivePage(item); }}
                        className={`nav-link rounded ${activePage === item ? 'bg-primary text-white' : 'text-dark'}`}
                            >{item}
                        </a>
                    </li>
                ))}
            </ul>

           
        </div >
    );
}

export default Sidebar;
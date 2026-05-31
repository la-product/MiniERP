import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.min.css";

function Sidebar({ activePage, setActivePage, user }) {
  const [openSection, setOpenSection] = useState("");

  const menu = [
    {
      label: "Customers",
      icon: "bi bi-people",
      items: ["Customer list", "Add customer"],
    },
    {
      label: "Products",
      icon: "bi bi-box",
      items: ["Product list", "Add product"],
    },
    { label: "Orders", icon: "bi bi-cart", items: ["Order list", "Add order"] },
    {
      label: "Invoices",
      icon: "bi bi-receipt",
      items: ["Invoice list", "Add invoice"],
    },
    ...(user?.role === 'Admin' ? [{
      label: "Users",
      icon: "bi bi-person-gear",
      items: ["User list", "Add user"],
    }] : []),
  ];

  return (
    <div
      className="bg-white border-end d-flex flex-column"
      style={{ width: 260, boxShadow: "2px 0 8px rgba(0,0,0,0.05)" }}
    >
      <div className="p-4 border-bottom">
        <h6
          className="text-uppercase text-muted mb-0"
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          <i className="bi bi-list me-2"></i>Navigace
        </h6>
      </div>
      <ul className="nav flex-column px-3 py-2">
        {menu.map((section) => (
          <li key={section.label} className="nav-item mb-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpenSection(
                  openSection === section.label ? "" : section.label,
                );
              }}
              className="nav-link rounded-2 text-dark d-flex justify-content-between align-items-center py-2 px-3"
              style={{
                transition: "all 0.2s ease",
                backgroundColor:
                  openSection === section.label ? "#e7f1ff" : "transparent",
                color: openSection === section.label ? "#0d6efd" : "#333",
              }}
            >
              <span>
                <i
                  className={`${section.icon} me-3`}
                  style={{ fontSize: "18px" }}
                ></i>
                <strong>{section.label}</strong>
              </span>
              <i
                className="bi bi-chevron-right"
                style={{
                  transition: "transform 0.2s",
                  transform:
                    openSection === section.label
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  fontSize: "16px",
                }}
              ></i>
            </a>
            {openSection === section.label && (
              <ul className="nav flex-column ps-4 mt-1">
                {section.items.map((item) => (
                  <li key={item} className="nav-item">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActivePage(item);
                      }}
                      className="nav-link rounded-2 py-2 px-3"
                      style={{
                        backgroundColor:
                          activePage === item ? "#7caffc" : "transparent",
                        color: activePage === item ? "white" : "#666",
                        transition: "all 0.2s ease",
                        fontSize: "14px",
                      }}
                    >
                      <i
                        className="bi bi-chevron-right me-2"
                        style={{ fontSize: "14px" }}
                      ></i>
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

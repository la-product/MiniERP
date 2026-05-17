**# MiniERP**



**Webová aplikace pro správu zákazníků, produktů, objednávek a faktur. Projekt je aktuálně ve vývoji.**



**## Technologie**



**\*\*Backend\*\***

**- ASP.NET Core Web API (.NET 9)**

**- Entity Framework Core + Pomelo MySQL driver**

**- MySQL databáze**



**\*\*Frontend\*\***

**- React + Vite (JavaScript)**

**- Bootstrap 5**

**- Bootstrap Icons**



**## Funkce**



**### Zákazníci**

**- \[x] Seznam zákazníků**

**- \[x] Přidání zákazníka**

**- \[x] Úprava zákazníka**



**### Produkty**

**- \[x] Seznam produktů se stavem skladu**

**- \[x] Přidání produktu**

**- \[x] Úprava produktu**



**### Objednávky**

**- \[x] Seznam objednávek**

**- \[x] Vytvoření objednávky (výběr zákazníka, produktů, dopravy a platby)**

**- \[x] Automatické odečtení skladu po vytvoření objednávky**

**- \[x] Změna stavu objednávky (New → Processing → Shipped → Completed)**

**- \[ ] Synchronizace s databází (v řešení)**



**### Faktury**

**- \[ ] Seznam faktur**

**- \[ ] Vytvoření faktury z objednávky**



**## Struktura projektu**



**```**

**MiniERP/**

**├── MiniERP.Server/           # ASP.NET Core backend**

**│   ├── Controllers/**

**│   │   ├── CustomersController.cs**

**│   │   ├── ProductsController.cs**

**│   │   └── OrdersController.cs**

**│   ├── Models/**

**│   │   ├── Customer.cs**

**│   │   ├── Products.cs**

**│   │   ├── Order.cs**

**│   │   └── OrderItem.cs**

**│   ├── Data/**

**│   │   └── AppDbContext.cs**

**│   └── Program.cs**

**└── minierp.client/           # React frontend**

&#x20;   **└── src/**

&#x20;       **├── components/**

&#x20;       **│   ├── Layout.jsx**

&#x20;       **│   └── Sidebar.jsx**

&#x20;       **├── pages/**

&#x20;       **│   ├── Customers.jsx**

&#x20;       **│   ├── Products.jsx**

&#x20;       **│   ├── Orders.jsx**

&#x20;       **│   └── Invoices.jsx**

&#x20;       **├── services/**

&#x20;       **│   ├── customerService.js**

&#x20;       **│   ├── productService.js**

&#x20;       **│   └── orderService.js**

&#x20;       **└── App.jsx**

**```**



**## Spuštění projektu**



**### Požadavky**

**- .NET 9 SDK**

**- Node.js**

**- MySQL server**



**### Backend**



**```bash**

**cd MiniERP.Server**

**dotnet restore**

**dotnet ef database update**

**dotnet run**

**```**



**Backend běží na `https://localhost:7270`.**



**### Frontend**



**```bash**

**cd minierp.client**

**npm install**

**npm run dev**

**```**



**Frontend běží na `https://localhost:65218`.**



**## API endpointy**



**| Metoda | Endpoint | Popis |**

**|--------|----------|-------|**

**| GET | `/api/customers` | Seznam zákazníků |**

**| POST | `/api/customers` | Přidání zákazníka |**

**| PUT | `/api/customers/{id}` | Úprava zákazníka |**

**| GET | `/api/products` | Seznam produktů |**

**| POST | `/api/products` | Přidání produktu |**

**| PUT | `/api/products/{id}` | Úprava produktu |**

**| GET | `/api/orders` | Seznam objednávek |**

**| POST | `/api/orders` | Vytvoření objednávky |**

**| PUT | `/api/orders/{id}/status` | Změna stavu objednávky |**



**## Stav projektu**



**Projekt je aktivně vyvíjen. Aktuálně se pracuje na synchronizaci objednávek s databází a propojení skladu s objednávkovým systémem.**




# ISP Billing Management System (NetFee BD Clone)

A modern full-stack web application for Internet Service Providers (ISPs), featuring automated customer billing, bandwidth & package management, MikroTik router integration, reseller & collector support, staff salary tracking, bilingual (English & Bengali) UI, and real-time dashboard analytics.

---

## 🚀 Features

- **Multi-Role Authentication**:
  - `superadmin`: Platform administrator
  - `admin`: System admin
  - `ispOwner`: ISP Company owner (full control)
  - `manager`: Office manager
  - `collector`: Field bill collector
  - `reseller`: Sub-ISP / Bandwidth reseller

- **Customer Management**:
  - PPPoE, Static IP, and Hotspot customer types
  - Add, edit, deactivate, view customer profile
  - Real-time balance, due amount, and billing day tracking
  - Customer search, filter by area, package, and status

- **Billing & Invoice System**:
  - Instant bill collection with automatic balance updating
  - Auto-generated invoices with PDF print support
  - Payment methods: Cash, Online, Mobile Banking (bKash, Nagad, etc.)
  - Monthly & Daily revenue reports

- **Network & MikroTik Integration**:
  - MikroTik RouterOS API connection
  - Real-time connection testing
  - Queue & profile synchronization for PPPoE and Hotspot

- **Reseller & Collector System**:
  - Dedicated portals & dashboards for resellers and collectors
  - Reseller balance recharging & commission distribution
  - Collector collection tracking and daily settlement

- **Area & Infrastructure**:
  - Area, Sub-Area, and Pole Box hierarchical mapping

- **Staff & Expenditure Management**:
  - Staff directory, monthly salaries, and payouts
  - ISP office expenditure categorisation and tracking

- **Bilingual Support (English & বাংলা)**:
  - Full UI translations with instant language switcher in the top navigation bar

- **Dark / Light Theme**:
  - Seamless toggle between light mode and dark mode

---

## 📁 Project Structure

```
isp-billing/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # 16 REST API controllers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── invoiceController.js
│   │   ├── packageController.js
│   │   ├── areaController.js
│   │   ├── resellerController.js
│   │   ├── collectorController.js
│   │   ├── managerController.js
│   │   ├── staffController.js
│   │   ├── expenditureController.js
│   │   ├── reportController.js
│   │   ├── mikrotikController.js
│   │   ├── supportTicketController.js
│   │   ├── dashboardController.js
│   │   └── activityLogController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protection & role authorization
│   │   ├── errorHandler.js       # Global error handler
│   │   └── validate.js
│   ├── models/                   # 19 Mongoose data models
│   │   ├── User.js, IspOwner.js, Manager.js, Collector.js, Reseller.js
│   │   ├── Customer.js, StaticCustomer.js, HotspotCustomer.js
│   │   ├── Package.js, Invoice.js, Area.js, SubArea.js, PoleBox.js
│   │   ├── Expenditure.js, Staff.js, Mikrotik.js, SupportTicket.js
│   │   └── ActivityLog.js, Message.js
│   ├── routes/                   # Express routes mounted under /api/v1
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # HTTP + Socket.io entry point (Port 9009)
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── apiLink.js        # Axios instance with JWT interceptors
    │   ├── app/
    │   │   └── store.js          # Redux Toolkit store + persistence
    │   ├── components/
    │   │   ├── cards/            # DashboardCard.jsx
    │   │   ├── common/           # Loader, Pagination, ConfirmModal, EmptyState
    │   │   └── layout/           # Sidebar, Header, Layout
    │   ├── features/             # 12 Redux slices
    │   ├── hooks/                # useAuth, useISPOwner
    │   ├── language/             # i18n setup with en.json and bn.json
    │   ├── pages/
    │   │   ├── auth/             # Login.jsx, Register.jsx
    │   │   ├── dashboard/        # Dashboard.jsx (Recharts + Stat cards)
    │   │   ├── customers/        # Customer, CustomerForm, CustomerProfile, BillCollect
    │   │   ├── packages/         # Package.jsx
    │   │   ├── billing/          # Invoice.jsx, InvoicePrint.jsx
    │   │   ├── area/             # Area.jsx (Area, SubArea, PoleBox tabs)
    │   │   ├── reseller/         # Reseller.jsx
    │   │   ├── collector/        # Collector.jsx
    │   │   ├── staff/            # Staff.jsx
    │   │   ├── expenditure/      # Expenditure.jsx
    │   │   ├── report/           # Report.jsx (Daily, Monthly, Collector)
    │   │   ├── settings/         # Settings.jsx (ISP Profile, SMS, Gateway)
    │   │   ├── mikrotik/         # Mikrotik.jsx (Router config + Test)
    │   │   ├── support/          # SupportTicket.jsx
    │   │   ├── profile/          # Profile.jsx
    │   │   └── NotFound.jsx
    │   ├── utils/                # helpers.js, constants.js
    │   ├── App.jsx               # React Router v6 setup
    │   ├── index.css             # Theme styles & variables
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ How to Run

### Prerequisites
1. **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
2. **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or a MongoDB Atlas cloud URI.

### 1. Setup Backend
Open a terminal in `isp-billing/backend`:
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:9009`.

### 2. Setup Frontend
Open another terminal in `isp-billing/frontend`:
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will run on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔑 Getting Started
1. Open the frontend in your browser.
2. Navigate to **Register** (`/register`) to create your first ISP Owner account.
3. Log in with your new credentials.
4. You will be greeted by the full ISP Dashboard!

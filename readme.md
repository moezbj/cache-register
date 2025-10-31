# Cash Register POS System

A complete Point of Sale (POS) system built with Electron, React 19, and SQLite.

## Features

✅ **Point of Sale**
- Product search and selection
- Real-time cart management
- Multiple payment methods (Cash, Card, Mobile)
- Receipt generation and printing
- Tax calculation

✅ **Inventory Management**
- Add, edit, and delete products
- Category management
- Stock tracking
- Low stock alerts
- Barcode support

✅ **Transaction History**
- View all transactions
- Filter by date range
- Detailed transaction view
- Payment method tracking

✅ **Reports & Analytics**
- Dashboard with key metrics
- Daily/Weekly/Monthly sales reports
- Top selling products
- Revenue analytics

✅ **User Management**
- Login/Logout system
- Role-based access (Admin, Cashier)
- Default admin account

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Clone/Create Project

Create the project directory structure as outlined in the files provided.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install React Dependencies

Since we're using CDN for React in development, you need to set up a proper build system for production. Install these additional packages:

```bash
npm install --save-dev @babel/core @babel/preset-react babel-loader webpack webpack-cli html-webpack-plugin
```

### Step 4: Run the Application

For development:
```bash
npm start
```

For production build:
```bash
npm run build
```

## Project Structure

```
cash-register-app/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.js            # Main entry point
│   │   ├── database.js         # SQLite database handler
│   │   ├── ipc-handlers.js     # IPC communication
│   │   └── preload.js          # Preload script
│   └── renderer/                # React frontend
│       ├── components/
│       │   ├── Auth/
│       │   │   └── Login.jsx
│       │   ├── Layout/
│       │   │   ├── Sidebar.jsx
│       │   │   └── Header.jsx
│       │   ├── POS/
│       │   │   ├── POSView.jsx
│       │   │   ├── ProductGrid.jsx
│       │   │   ├── Cart.jsx
│       │   │   ├── PaymentModal.jsx
│       │   │   └── Receipt.jsx
│       │   ├── Inventory/
│       │   │   ├── InventoryView.jsx
│       │   │   └── ProductForm.jsx
│       │   ├── Transactions/
│       │   │   └── TransactionsView.jsx
│       │   └── Reports/
│       │       └── ReportsView.jsx
│       ├── contexts/
│       │   └── AppContext.jsx
│       ├── App.jsx
│       ├── index.jsx
│       └── index.html
├── package.json
└── README.md
```

## Database Schema

### Products Table
- id (PRIMARY KEY)
- name (TEXT)
- barcode (TEXT)
- category (TEXT)
- price (REAL)
- cost (REAL)
- stock (INTEGER)
- image (TEXT)
- created_at (DATETIME)

### Transactions Table
- id (PRIMARY KEY)
- total (REAL)
- subtotal (REAL)
- tax (REAL)
- discount (REAL)
- payment_method (TEXT)
- user_id (INTEGER)
- created_at (DATETIME)

### Transaction Items Table
- id (PRIMARY KEY)
- transaction_id (INTEGER)
- product_id (INTEGER)
- product_name (TEXT)
- quantity (INTEGER)
- price (REAL)

### Users Table
- id (PRIMARY KEY)
- username (TEXT)
- password (TEXT)
- full_name (TEXT)
- role (TEXT)
- created_at (DATETIME)

### Categories Table
- id (PRIMARY KEY)
- name (TEXT)
- created_at (DATETIME)

## Default Login Credentials

**Username:** admin  
**Password:** admin123

## Usage Guide

### 1. Login
- Use the default credentials or create new users
- Admin users have full access

### 2. Point of Sale
- Search for products using the search bar
- Filter by category
- Click on products to add to cart
- Adjust quantities as needed
- Click "Proceed to Payment"
- Select payment method
- Complete the transaction

### 3. Inventory Management
- Add new products with the "+ Add Product" button
- Edit existing products
- Delete products (be careful!)
- Monitor stock levels
- Products with stock < 10 show as low stock

### 4. View Transactions
- See all completed transactions
- Filter by date range
- View detailed transaction information
- Track payment methods

### 5. Reports
- View today's sales and statistics
- Analyze sales trends over time
- See top-selling products
- Monitor low stock items

## Configuration

### Tax Rate
The default tax rate is 10%. To change it, modify the `getCartTax` function in `src/renderer/contexts/AppContext.jsx`:

```javascript
const getCartTax = (taxRate = 0.10) => {
  return getCartSubtotal() * taxRate;
};
```

### Low Stock Threshold
Default threshold is 10 items. Change in database queries and display logic as needed.

## Building for Production

### Windows
```bash
npm run build
```
This creates an installer in the `dist` folder.

### macOS
```bash
npm run build
```
Creates a .dmg file in the `dist` folder.

### Linux
```bash
npm run build
```
Creates an AppImage in the `dist` folder.

## Troubleshooting

### Database Issues
- Database is stored in the app's userData directory
- On Windows: `C:\Users\{username}\AppData\Roaming\cash-register\`
- On macOS: `~/Library/Application Support/cash-register/`
- On Linux: `~/.config/cash-register/`

### React Not Loading
- Make sure you're using the correct Node version
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Build Errors
- Ensure all dependencies are installed
- Check that better-sqlite3 is rebuilt for Electron: `npm run postinstall`

## Future Enhancements

- [ ] Barcode scanner integration
- [ ] Receipt printer support (ESC/POS)
- [ ] Customer management
- [ ] Loyalty program
- [ ] Discount/Coupon system
- [ ] Multi-currency support
- [ ] Cloud backup
- [ ] Multi-store support
- [ ] Email receipts
- [ ] Advanced reporting with charts

## License

MIT License

## Support

For issues and questions, please create an issue on the project repository.

## Credits

Built with:
- Electron
- React 19
- SQLite (better-sqlite3)
- Tailwind CSS
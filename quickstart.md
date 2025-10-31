# Quick Setup Guide

## Step-by-Step Setup

### 1. Create Project Structure

Create the following directory structure:

```
cash-register/
├── src/
│   ├── main/
│   └── renderer/
│       └── components/
│           ├── Auth/
│           ├── Layout/
│           ├── POS/
│           ├── Inventory/
│           ├── Transactions/
│           └── Reports/
```

### 2. Copy Files

Copy all the provided files into their respective directories as shown in the file headers.

### 3. Install Dependencies

```bash
# Navigate to project directory
cd cash-register

# Initialize npm if not already done
npm init -y

# Install main dependencies
npm install electron better-sqlite3 electron-squirrel-startup

# Install dev dependencies
npm install -D electron-builder @electron/rebuild

# For React in production build (optional)
npm install react react-dom
npm install -D @babel/core @babel/preset-react webpack webpack-cli babel-loader html-webpack-plugin
```

### 4. Update package.json

Make sure your package.json has these scripts:

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "postinstall": "electron-builder install-app-deps"
  }
}
```

### 5. For Development with React

Since we're using CDN for React in the HTML file, you can start immediately:

```bash
npm start
```

### 6. For Production Build

For production, you'll want to bundle React properly. Here's a basic webpack config:

**webpack.config.js**:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/renderer/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
```

Then update scripts:
```json
{
  "scripts": {
    "start": "electron .",
    "build:renderer": "webpack",
    "build": "npm run build:renderer && electron-builder",
    "postinstall": "electron-builder install-app-deps"
  }
}
```

### 7. Testing the Application

1. Run `npm start`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. Try adding products in Inventory
4. Make a test sale in POS
5. Check Reports and Transactions

## Common Issues and Solutions

### Issue: better-sqlite3 not working

**Solution:**
```bash
npm rebuild better-sqlite3 --build-from-source
# or
npm run postinstall
```

### Issue: React not loading

**Solution:**
- Check that index.html is correctly linking to React CDN
- For production, ensure webpack is properly configured
- Check browser console for errors

### Issue: Database not initializing

**Solution:**
- Check app userData directory exists
- Ensure write permissions
- Check console for SQLite errors

### Issue: IPC errors

**Solution:**
- Verify preload.js is correctly loaded in main process
- Check that contextIsolation is enabled
- Ensure window.api is available in renderer

## Development Tips

### Hot Reload for React

Install additional dev dependencies:
```bash
npm install -D webpack-dev-server
```

Add dev script:
```json
{
  "dev": "webpack serve --mode development",
  "dev:electron": "electron ."
}
```

### Debugging

1. Open DevTools in Electron:
   - In main/index.js, add: `mainWindow.webContents.openDevTools();`

2. Main process debugging:
   - Use `console.log()` - output appears in terminal
   - Or use VS Code debugger with launch.json

3. Check database content:
   - Use SQLite browser or CLI tools
   - Database location is logged on startup

### Adding Sample Data

You can add sample products by inserting into the database or creating a seed script:

```javascript
// In database.js, add to seedDefaultData method:
const sampleProducts = [
  { name: 'Laptop', barcode: '123456', category: 'Electronics', price: 999.99, cost: 700, stock: 10 },
  { name: 'Mouse', barcode: '123457', category: 'Electronics', price: 29.99, cost: 15, stock: 50 },
  { name: 'Coffee', barcode: '123458', category: 'Food & Beverage', price: 4.99, cost: 2, stock: 100 },
];

const insertProduct = this.db.prepare(`
  INSERT OR IGNORE INTO products (name, barcode, category, price, cost, stock)
  VALUES (?, ?, ?, ?, ?, ?)
`);

sampleProducts.forEach(p => {
  insertProduct.run(p.name, p.barcode, p.category, p.price, p.cost, p.stock);
});
```

## Next Steps

1. Customize the UI/UX to match your branding
2. Add barcode scanner support
3. Integrate receipt printer
4. Add cloud backup functionality
5. Implement advanced reporting with charts
6. Add customer management features
7. Create user roles and permissions system
8. Add multi-language support

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Need Help?

- Check the main README.md for detailed feature documentation
- Review the code comments in each file
- Test each component individually
- Use console.log extensively for debugging
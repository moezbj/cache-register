const Database = require('better-sqlite3');

class CashRegisterDB {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeTables();
    this.seedDefaultData();
  }

  initializeTables() {
    // Products table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        category TEXT,
        price REAL NOT NULL,
        cost REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        payment_method TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Transaction items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        product_id INTEGER,
        product_name TEXT,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'cashier',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  seedDefaultData() {
    // Check if we have any users
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (userCount.count === 0) {
      // Create default admin user (password: admin123)
      this.db.prepare(`
        INSERT INTO users (username, password, full_name, role)
        VALUES (?, ?, ?, ?)
      `).run('admin', 'admin123', 'Administrator', 'admin');
    }

    // Add some default categories
    const categoryCount = this.db.prepare('SELECT COUNT(*) as count FROM categories').get();
    if (categoryCount.count === 0) {
      const categories = ['Electronics', 'Food & Beverage', 'Clothing', 'Home & Garden', 'Sports', 'Other'];
      const insertCategory = this.db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
      
      categories.forEach(cat => {
        insertCategory.run(cat);
      });
    }
  }

  // Product methods
  getAllProducts() {
    return this.db.prepare('SELECT * FROM products ORDER BY name').all();
  }

  getProductById(id) {
    return this.db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  }

  getProductByBarcode(barcode) {
    return this.db.prepare('SELECT * FROM products WHERE barcode = ?').get(barcode);
  }

  searchProducts(query) {
    const searchTerm = `%${query}%`;
    return this.db.prepare(`
      SELECT * FROM products 
      WHERE name LIKE ? OR barcode LIKE ? OR category LIKE ?
      ORDER BY name
    `).all(searchTerm, searchTerm, searchTerm);
  }

  addProduct(product) {
    const stmt = this.db.prepare(`
      INSERT INTO products (name, barcode, category, price, cost, stock, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      product.name,
      product.barcode || null,
      product.category,
      product.price,
      product.cost || 0,
      product.stock || 0,
      product.image || null
    );
    
    return result.lastInsertRowid;
  }

  updateProduct(id, product) {
    const stmt = this.db.prepare(`
      UPDATE products 
      SET name = ?, barcode = ?, category = ?, price = ?, cost = ?, stock = ?, image = ?
      WHERE id = ?
    `);
    
    return stmt.run(
      product.name,
      product.barcode || null,
      product.category,
      product.price,
      product.cost,
      product.stock,
      product.image || null,
      id
    );
  }

  deleteProduct(id) {
    return this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }

  updateStock(productId, quantity) {
    return this.db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(quantity, productId);
  }

  // Transaction methods
  createTransaction(transaction, items) {
    const trans = this.db.transaction((txData, txItems) => {
      // Validate stock before processing
      const checkStock = this.db.prepare('SELECT stock FROM products WHERE id = ?');
      
      for (const item of txItems) {
        const product = checkStock.get(item.product_id);
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product_name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
      }

      // Insert transaction
      const stmt = this.db.prepare(`
        INSERT INTO transactions (total, subtotal, tax, discount, payment_method, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        txData.total,
        txData.subtotal,
        txData.tax || 0,
        txData.discount || 0,
        txData.payment_method,
        txData.user_id
      );
      
      const transactionId = result.lastInsertRowid;

      // Insert transaction items and update stock
      const itemStmt = this.db.prepare(`
        INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const stockStmt = this.db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      txItems.forEach(item => {
        itemStmt.run(transactionId, item.product_id, item.product_name, item.quantity, item.price);
        // Reduce stock after successful sale
        stockStmt.run(item.quantity, item.product_id);
      });

      return transactionId;
    });

    return trans(transaction, items);
  }

  getTransactions(startDate = null, endDate = null) {
    let query = 'SELECT * FROM transactions ORDER BY created_at DESC';
    
    if (startDate && endDate) {
      query = `
        SELECT * FROM transactions 
        WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
        ORDER BY created_at DESC
      `;
      return this.db.prepare(query).all(startDate, endDate);
    }
    
    return this.db.prepare(query).all();
  }

  getTransactionById(id) {
    const transaction = this.db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (transaction) {
      transaction.items = this.db.prepare('SELECT * FROM transaction_items WHERE transaction_id = ?').all(id);
    }
    return transaction;
  }

  // Report methods
  getSalesReport(startDate, endDate) {
    return this.db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transaction_count,
        SUM(subtotal) as total_sales,
        SUM(tax) as total_tax,
        SUM(total) as total_revenue,
        AVG(total) as average_sale
      FROM transactions
      WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all(startDate, endDate);
  }

  getTopProducts(limit = 10) {
    return this.db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.category,
        SUM(ti.quantity) as total_sold,
        SUM(ti.quantity * ti.price) as revenue
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?
    `).all(limit);
  }

  getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const todaySales = this.db.prepare(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(total), 0) as total
      FROM transactions
      WHERE DATE(created_at) = DATE(?)
    `).get(today);

    const lowStock = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM products
      WHERE stock < 10
    `).get();

    const totalProducts = this.db.prepare('SELECT COUNT(*) as count FROM products').get();

    return {
      todaySales: todaySales.total,
      todayTransactions: todaySales.count,
      lowStockItems: lowStock.count,
      totalProducts: totalProducts.count
    };
  }

  // Category methods
  getAllCategories() {
    return this.db.prepare('SELECT * FROM categories ORDER BY name').all();
  }

  addCategory(name) {
    return this.db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
  }

  // User methods
  getUserByUsername(username) {
    return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }

  getAllUsers() {
    return this.db.prepare('SELECT id, username, full_name, role, created_at FROM users').all();
  }

  addUser(user) {
    return this.db.prepare(`
      INSERT INTO users (username, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `).run(user.username, user.password, user.full_name, user.role || 'cashier');
  }

  close() {
    this.db.close();
  }
}

module.exports = CashRegisterDB;
function setupIPCHandlers(ipcMain, db) {
    // Product handlers
    ipcMain.handle('products:getAll', async () => {
      try {
        return { success: true, data: db.getAllProducts() };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:getById', async (event, id) => {
      try {
        return { success: true, data: db.getProductById(id) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:search', async (event, query) => {
      try {
        return { success: true, data: db.searchProducts(query) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:getByBarcode', async (event, barcode) => {
      try {
        return { success: true, data: db.getProductByBarcode(barcode) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:add', async (event, product) => {
      try {
        const id = db.addProduct(product);
        return { success: true, data: { id } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:update', async (event, id, product) => {
      try {
        db.updateProduct(id, product);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('products:delete', async (event, id) => {
      try {
        db.deleteProduct(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    // Transaction handlers
    ipcMain.handle('transactions:create', async (event, transaction, items) => {
      try {
        const id = db.createTransaction(transaction, items);
        return { success: true, data: { id } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('transactions:getAll', async (event, startDate, endDate) => {
      try {
        return { success: true, data: db.getTransactions(startDate, endDate) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('transactions:getById', async (event, id) => {
      try {
        return { success: true, data: db.getTransactionById(id) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    // Report handlers
    ipcMain.handle('reports:sales', async (event, startDate, endDate) => {
      try {
        return { success: true, data: db.getSalesReport(startDate, endDate) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('reports:topProducts', async (event, limit) => {
      try {
        return { success: true, data: db.getTopProducts(limit) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('reports:dashboard', async () => {
      try {
        return { success: true, data: db.getDashboardStats() };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    // Category handlers
    ipcMain.handle('categories:getAll', async () => {
      try {
        return { success: true, data: db.getAllCategories() };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('categories:add', async (event, name) => {
      try {
        const result = db.addCategory(name);
        return { success: true, data: { id: result.lastInsertRowid } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    // User handlers
    ipcMain.handle('users:login', async (event, username, password) => {
      try {
        const user = db.getUserByUsername(username);
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user;
          return { success: true, data: userWithoutPassword };
        }
        return { success: false, error: 'Invalid credentials' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('users:getAll', async () => {
      try {
        return { success: true, data: db.getAllUsers() };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('users:add', async (event, user) => {
      try {
        const result = db.addUser(user);
        return { success: true, data: { id: result.lastInsertRowid } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  }
  
  module.exports = { setupIPCHandlers };
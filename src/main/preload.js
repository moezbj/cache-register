const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Products
  products: {
    getAll: () => ipcRenderer.invoke('products:getAll'),
    getById: (id) => ipcRenderer.invoke('products:getById', id),
    search: (query) => ipcRenderer.invoke('products:search', query),
    getByBarcode: (barcode) => ipcRenderer.invoke('products:getByBarcode', barcode),
    add: (product) => ipcRenderer.invoke('products:add', product),
    update: (id, product) => ipcRenderer.invoke('products:update', id, product),
    delete: (id) => ipcRenderer.invoke('products:delete', id)
  },

  // Transactions
  transactions: {
    create: (transaction, items) => ipcRenderer.invoke('transactions:create', transaction, items),
    getAll: (startDate, endDate) => ipcRenderer.invoke('transactions:getAll', startDate, endDate),
    getById: (id) => ipcRenderer.invoke('transactions:getById', id)
  },

  // Reports
  reports: {
    sales: (startDate, endDate) => ipcRenderer.invoke('reports:sales', startDate, endDate),
    topProducts: (limit) => ipcRenderer.invoke('reports:topProducts', limit),
    dashboard: () => ipcRenderer.invoke('reports:dashboard')
  },

  // Categories
  categories: {
    getAll: () => ipcRenderer.invoke('categories:getAll'),
    add: (name) => ipcRenderer.invoke('categories:add', name)
  },

  // Users
  users: {
    login: (username, password) => ipcRenderer.invoke('users:login', username, password),
    getAll: () => ipcRenderer.invoke('users:getAll'),
    add: (user) => ipcRenderer.invoke('users:add', user)
  }
});
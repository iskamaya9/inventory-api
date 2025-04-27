const db = require('../config');

const resolvers = {
  Query: {
    listUsers: async () => {
      const [rows] = await db.query("SELECT * FROM users");
      return rows;
    },
    listCustomers: async () => {
      const [rows] = await db.query("SELECT * FROM customers");
      return rows;
    },
    listCategories: async () => {
      const [rows] = await db.query("SELECT * FROM categories");
      return rows;
    },
    listProducts: async () => {
      const [rows] = await db.query("SELECT * FROM products");
      return rows;
    },
    listSales: async () => {
      const [rows] = await db.query("SELECT * FROM sales");
      return rows;
    },
    getProduct: async (_, { id }) => {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      return rows[0];
    },
    getCustomer: async (_, { id }) => {
      const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
      return rows[0];
    },
    login: async (_, { email, password }) => {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);
      if (!rows.length) {
        throw new Error("Invalid credentials");
      }
      const user = rows[0];
      const token = 'A1234556GT56'; 
      return { token, user };
    },
    dailySalesReport: async (_, { date }) => {
      if (!date) throw new Error("Date is required.");

      const [sales] = await db.query(
        `SELECT * FROM sales WHERE DATE(created_at) = ?`, [date]
      );
      return sales;
    },

    topSellingProducts: async (_, { limit }) => {
      if (!limit) throw new Error("Limit is required.");

      const [products] = await db.query(`
        SELECT p.id, p.name, p.sku, p.price, p.stock, p.Category_id as categoryId, p.created_at, p.updated_at
        FROM products p
        JOIN (
          SELECT Product_id, SUM(quantity) as totalSold
          FROM sale_items
          GROUP BY Product_id
          ORDER BY totalSold DESC
          LIMIT ?
        ) s ON p.id = s.Product_id
      `, [limit]);
      
      return products;
    },

    lowStockProducts: async (_, { threshold }) => {
      if (threshold == null) throw new Error("Threshold is required.");

      const [products] = await db.query(
        `SELECT * FROM products WHERE stock <= ?`, [threshold]
      );
      return products;
    }
  },
  

  Mutation: {
    addUser: async (_, { name, email, password, role }) => {
      if (!name || !email || !password || !role) {
        throw new Error("All fields (name, email, password, role) are required.");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.query(
        "INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [name, email, hashedPassword, role]
      );
      return { id: result.insertId, name, email, password: hashedPassword, role };
    },
    addCustomer: async (_, { name, email, phone, address }) => {
      if (!name || !email || !phone || !address) {
        throw new Error("All fields (name, email, phone, address) are required.");
      }

      const [result] = await db.query(
        "INSERT INTO customers (name, email, phone, address, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [name, email, phone, address]
      );
      return { id: result.insertId, name, email, phone, address };
    },
    addCategory: async (_, { name }) => {
      if (!name) {
        throw new Error("Category name is required.");
      }

      const [result] = await db.query(
        "INSERT INTO categories (name, created_at, updated_at) VALUES (?, NOW(), NOW())",
        [name]
      );
      return { id: result.insertId, name };
    },
    addProduct: async (_, { name, sku, price, stock, category_id }) => {
      if (!name || !sku || !price || !stock || !category_id) {
        throw new Error("All fields (name, sku, price, stock, categoryId) are required.");
      }

      const [result] = await db.query(
        "INSERT INTO products (name, sku, price, stock, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [name, sku, price, stock, category_id]
      );
      return { id: result.insertId, name, sku, price, stock, category_id };
    },
    updateProduct: async (_, { id, name, price, stock }) => {
      if (!id || !name || price == null || stock == null) {
        throw new Error("All fields (id, name, price, stock) are required.");
      }

      await db.query(
        "UPDATE products SET name = ?, price = ?, stock = ?, updated_at = NOW() WHERE id = ?",
        [name, price, stock, id]
      );
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      return rows[0];
    },

    deleteProduct: async (_, { id }) => {
      if (!id) {
        throw new Error("Product ID is required.");
      }
    
      const [saleItemsResult] = await db.query(
        `SELECT count(*) as count FROM sale_items WHERE product_id = ?`, [id]
      );
      
      const saleItemsCount = saleItemsResult[0].count;
      
      if (saleItemsCount > 0) {
        throw new Error("Cannot delete product with associated sale items.");
      } else {
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        return `Product with ID ${id} deleted.`;
      }
    },

    createSale: async (_, { user_id, customer_id, items }) => {
      if (!user_id || !customer_id || !items || !items.length) {
        throw new Error("UserId, CustomerId, and sale items are required.");
      }

      let total = 0;
      for (let item of items) {
        total += item.quantity * item.price;
      }

      const [saleResult] = await db.query(
        "INSERT INTO sales (total, User_id, Customer_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [total, user_id, customer_id]
      );
      const saleId = saleResult.insertId;

      for (let item of items) {
        await db.query(
          "INSERT INTO sale_items (Sale_id, Product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
          [saleId, item.product_id, item.quantity, item.price]
        );
      }

      const [rows] = await db.query("SELECT * FROM sales WHERE id = ?", [saleId]);
      return rows[0];
    }
  }
};

module.exports = resolvers;

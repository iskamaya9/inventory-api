CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  sku VARCHAR(50) UNIQUE,
  price DECIMAL(10,2),
  stock INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE products ADD category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES categories(id);


CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_id INT,
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);


CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users ( name, email, password, role, created_at, updated_at) VALUES
( 'Admin Toko', 'admin@toko.com', 'admin123', 'admin', NOW(), NOW()),
( 'Staff 1', 'staff1@toko.com', 'staff123', 'staff', NOW(), NOW()),
( 'Staff 2', 'staff2@toko.com', 'staff123', 'staff', NOW(), NOW()),
( 'Staff 3', 'staff3@toko.com', 'staff123', 'staff', NOW(), NOW()),
( 'Staff 4', 'staff4@toko.com', 'staff123', 'staff', NOW(), NOW());

INSERT INTO categories ( name, created_at, updated_at) VALUES
( 'Minuman', NOW(), NOW()),
( 'Pakaian', NOW(), NOW()),
( 'Makanan', NOW(), NOW()),
( 'Peralatan Rumah', NOW(), NOW()),
( 'Buku', NOW(), NOW());

INSERT INTO products ( name, sku, price, stock, category_id, created_at, updated_at) VALUES
( 'Nescafe', 'SKU001', 8000, 10, 1, NOW(), NOW()),
( 'Kemeja Pria', 'SKU002', 150000, 30, 2, NOW(), NOW()),
( 'Snack Coklat', 'SKU003', 20000, 100, 3, NOW(), NOW()),
( 'Panci Set', 'SKU004', 300000, 15, 4, NOW(), NOW()),
( 'Novel Remaja', 'SKU005', 80000, 25, 5, NOW(), NOW());

INSERT INTO customers ( name, email, phone, address, created_at, updated_at) VALUES
( 'Budi Santoso', 'budi@gmail.com', '081234567890', 'Jl. Merdeka 10', NOW(), NOW()),
( 'Siti Aminah', 'siti@gmail.com', '081234567891', 'Jl. Sudirman 20', NOW(), NOW()),
('Rudi Hartono', 'rudi@gmail.com', '081234567892', 'Jl. Ahmad Yani 15', NOW(), NOW()),
( 'Dewi Lestari', 'dewi@gmail.com', '081234567893', 'Jl. Gatot Subroto 5', NOW(), NOW()),
('Andi Wijaya', 'andi@gmail.com', '081234567894', 'Jl. Pemuda 7', NOW(), NOW());

INSERT INTO sales ( total, user_id, customer_id, created_at, updated_at) VALUES
( 8000000, 2, 1, NOW(), NOW()),
( 320000, 2, 2, NOW(), NOW()),
( 60000, 3, 3, NOW(), NOW()),
( 90000, 4, 4, NOW(), NOW()),
( 300000, 5, 5, NOW(), NOW());

INSERT INTO sale_items ( sale_id, product_id, quantity, price, created_at, updated_at) VALUES
( 1, 1, 2, 16000, NOW(), NOW()), -- nescafe
( 1, 3, 5, 100000, NOW(), NOW()), -- Snack Coklat
( 2, 2, 2, 300000, NOW(), NOW()), -- Kemeja
( 3, 3, 3, 60000, NOW(), NOW()), -- Snack Coklat
( 4, 5, 1, 80000, NOW(), NOW()), -- Novel
( 5, 4, 1, 300000, NOW(), NOW()); -- Panci Set

 

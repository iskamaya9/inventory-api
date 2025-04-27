const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: String!
    created_at: Date!
    updated_at: Date!
  }

  type Customer {
    id: ID!
    name: String!
    email: String
    phone: String
    address: String
    created_at: Date!
    updated_at: Date!
  }

  type Category {
    id: ID!
    name: String!
    created_at: Date!
    updated_at: Date!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    price: Float!
    stock: Int!
    category: Category
    category_id: ID!
    created_at: Date!
    updated_at: Date!
  }

  type SaleItem {
    id: ID!
    Sale_id: ID!
    Product_id: ID!
    quantity: Int!
    price: Float!
    created_at: Date!
    updated_at: Date!
  }

  type Sale {
    id: ID!
    total: Float!
    user_id: ID!
    customer_id: ID!
    customer: Customer
    user: User
    items: [SaleItem]
    created_at: Date!
    updated_at: Date!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    listUsers: [User]
    listCustomers: [Customer]
    listCategories: [Category]
    listProducts: [Product]
    listSales: [Sale]
    getProduct(id: ID!): Product
    getCustomer(id: ID!): Customer
    login(email: String!, password: String!): AuthPayload

    dailySalesReport(date: String!): [Sale]
    topSellingProducts(limit: Int!): [Product]
    lowStockProducts(threshold: Int!): [Product]
  }

  input SaleItemInput {
    product_id: ID!
    quantity: Int!
    price: Float!
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!, role: String!): User
    addCustomer(name: String!, email: String, phone: String, address: String): Customer
    addCategory(name: String!): Category
    addProduct(name: String!, sku: String!, price: Float!, stock: Int!, category_id: ID!): Product
    updateProduct(id: ID!, name: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): String
    createSale(user_id: ID!, customer_id: ID!, items: [SaleItemInput]!): Sale
  }
`;

module.exports = typeDefs;

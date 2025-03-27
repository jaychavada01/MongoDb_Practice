# 🛠 User Management API

This is a **User Management API** built with **Node.js, Express, MongoDB, and Mongoose**.  
It supports **User Authentication**, **Soft Deletion**, **Search**, **Pagination**, **Sorting**, and **Aggregation Queries**.

---

## 🚀 Features

✅ **User Authentication**

- Register
- Login
- Logout (Token Removal from DB)

✅ **User Management**

- Update User
- Soft Delete User (Flag `isDeleted: true`)
- Restore Soft Deleted User

✅ **Advanced Querying**

- Search by Name & Email
- Sort Users
- Pagination
- Aggregation Queries (Group Users by Email Domain)

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **JWT Authentication**
- **bcrypt.js** (for password hashing)
- **dotenv** (for environment variables)
- **Postman** (for API testing)

---

### Setup Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_secret_key
```

### Start the Server

```bash
npm run server
```

---

## 🔗 API Endpoints

### **🔹 Authentication**

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/users/register` | Register a user       |
| POST   | `/users/login`    | Login a user          |
| POST   | `/users/logout`   | Logout (Remove Token) |

### **🔹 User Management**

| Method | Endpoint     | Description                              |
| ------ | ------------ | ---------------------------------------- |
| GET    | `/users/all` | Get all users (pagination, search, sort) |
| GET    | `/users/:id` | Get user by ID (excluding soft-deleted)  |
| PUT    | `/users/:id` | Update user (if not soft-deleted)        |
| DELETE | `/users/:id` | Soft delete user                         |

### **🔹 Extra Queries**

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/users/aggregate/domains` | Group users by email domain |

---

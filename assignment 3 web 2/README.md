# ShopLite E-commerce API

## 📋 Project Overview
Full-stack e-commerce application with MongoDB Atlas backend and Express.js API. Built for Web Development Assignment 3.

**Topic:** E-commerce Product Management System

**Primary Object:** Products (Electronics, Apparel, Home goods)  
**Secondary Object:** Reviews/Ratings

---

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set permissions to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0...`)

### 2. Project Installation

```powershell
# Navigate to project directory
cd "c:\Users\Lenovo\Desktop\assignment 3 web 2"

# Install dependencies
npm install
```

### 3. Environment Configuration

1. **Create `.env` file** (copy from `.env.example`):
```powershell
Copy-Item .env.example .env
```

2. **Edit `.env` file** with your MongoDB credentials:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/shoplite?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

**Important:** Replace:
- `your-username` with your MongoDB username
- `your-password` with your MongoDB password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### 4. Start the Server

```powershell
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:3000
📊 Admin interface: http://localhost:3000/admin
```

---

## 📡 API Endpoints

### Products Endpoints

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| **POST** | `/api/products` | Create new product | name, price, description, category |
| **GET** | `/api/products` | Get all products | - |
| **GET** | `/api/products/:id` | Get single product by ID | - |
| **PUT** | `/api/products/:id` | Update product | name, price, description, category |
| **DELETE** | `/api/products/:id` | Delete product | - |

### Reviews Endpoints

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| **POST** | `/api/reviews` | Create new review | productId, author, rating, comment |
| **GET** | `/api/reviews` | Get all reviews | - |
| **GET** | `/api/reviews/:id` | Get single review by ID | - |
| **PUT** | `/api/reviews/:id` | Update review | productId, author, rating, comment |
| **DELETE** | `/api/reviews/:id` | Delete review | - |

---

## 🧪 Testing with Postman

### Example: Create Product

**Request:**
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "iPhone 17 Pro Max",
  "price": 499999,
  "description": "Latest flagship smartphone with advanced features",
  "category": "electronics",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 50
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 17 Pro Max",
    "price": 499999,
    "description": "Latest flagship smartphone with advanced features",
    "category": "electronics",
    "imageUrl": "https://example.com/image.jpg",
    "stock": 50,
    "createdAt": "2026-01-17T10:00:00.000Z",
    "updatedAt": "2026-01-17T10:00:00.000Z"
  }
}
```

### Example: Get All Products

**Request:**
```
GET http://localhost:3000/api/products?category=electronics
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 17 Pro Max",
      "price": 499999,
      ...
    }
  ]
}
```

### Example: Create Review

**Request:**
```
POST http://localhost:3000/api/reviews
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "author": "John Doe",
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

---

## 🖥️ Admin Interface

Access the admin panel at: **http://localhost:3000/admin**

Features:
- ✅ Test all API endpoints
- ✅ View real-time responses
- ✅ Create, read, update, delete products
- ✅ Manage reviews
- ✅ API health check
- ✅ Dark/Light mode

---

## 📦 Database Schema

### Product Schema
```javascript
{
  name: String (required, 3-200 chars),
  price: Number (required, >= 0),
  description: String (required, 10-2000 chars),
  category: String (required, enum: ['electronics', 'apparel', 'home', 'other']),
  imageUrl: String (optional),
  stock: Number (default: 0),
  featured: Boolean (default: false),
  ratings: {
    average: Number (0-5),
    count: Number
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Review Schema
```javascript
{
  productId: ObjectId (required, ref: Product),
  author: String (required, 2-100 chars),
  rating: Number (required, 1-5),
  comment: String (required, 10-1000 chars),
  verified: Boolean (default: false),
  helpful: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## ✅ Error Handling

### Status Codes
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error

### Example Error Response
```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

---

## 📁 Project Structure

```
assignment 3 web 2/
├── models/
│   ├── Product.js          # Product schema & model
│   └── Review.js           # Review schema & model
├── routes/
│   ├── products.js         # Product CRUD routes
│   └── reviews.js          # Review CRUD routes
├── public/
│   ├── admin.html          # Admin interface
│   ├── index.html          # Store homepage
│   ├── products.html       # Products page
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout page
│   └── assets/
│       ├── css/style.css
│       └── js/app.js
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example            # Environment template
└── README.md               # This file
```

---

## 🎯 Grading Criteria Checklist

- ✅ **Core Functionality (30%)**: All CRUD operations work with MongoDB
- ✅ **Topic & Schema Design (10%)**: Product and Review schemas with proper validation
- ✅ **Code Organization (10%)**: Clean structure with models, routes, middleware
- ✅ **Defense (50%)**: Complete documentation and working demo

### Features Implemented:
1. ✅ MongoDB Atlas connection
2. ✅ Two complex schemas (Products + Reviews)
3. ✅ Full CRUD for Products (POST, GET, GET by ID, PUT, DELETE)
4. ✅ Full CRUD for Reviews
5. ✅ Request validation with express-validator
6. ✅ Proper error handling with status codes
7. ✅ Admin interface for testing
8. ✅ Timestamps (createdAt, updatedAt)
9. ✅ Relationships (Reviews reference Products)
10. ✅ Query filters (category, sorting)

---

## 🔧 Troubleshooting

### Cannot connect to MongoDB
- Check if your IP is whitelisted (0.0.0.0/0 for development)
- Verify username/password in `.env`
- Ensure connection string format is correct

### Port already in use
```powershell
# Change PORT in .env file
PORT=3001
```

### Module not found errors
```powershell
npm install
```

---

## 📞 Support

For questions during defense:
- **Author:** Ulykbek
- **Project:** ShopLite E-commerce API
- **Date:** January 2026

---

## 📝 Notes for Defense

**Key Points to Explain:**
1. MongoDB Atlas setup and connection
2. Schema design with validation
3. RESTful API structure
4. Error handling strategy
5. How this serves the Final Project (e-commerce platform)
6. Relationship between Products and Reviews
7. Admin interface functionality

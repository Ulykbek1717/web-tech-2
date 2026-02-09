# ShopLite E-commerce

Full-stack e-commerce application with JWT authentication and role-based access control.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

3. Run the server:
```bash
npm start
```

Visit: `http://localhost:3000`

##  Deployment

**Live Demo:** `https://your-app-name.onrender.com` (after deployment)

### Deploy to Render

See detailed deployment instructions:
-  [Full Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete step-by-step guide in Russian
-  [Quick Deploy Guide](./QUICK_DEPLOY.md) - Quick reference
-  [Docker Deploy Guide](./DOCKER_DEPLOY.md) - Deploy with Docker (optional)

**Quick steps:**
1. Set up MongoDB Atlas (free tier)
2. Push code to GitHub
3. Create Render Web Service
4. Add environment variables
5. Deploy!

## Features

- Product catalog with search and filters
- Shopping cart and checkout
- User authentication (JWT)
- Role-based access: Client, Admin, Superadmin
- Order management
- Product reviews
- Responsive design with dark mode



## API Endpoints

### Public
- `GET /api/products` - Get all products
- `GET /api/reviews` - Get all reviews
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Protected (requires login)
- `POST /api/orders` - Create order
- `POST /api/reviews` - Create review
- `GET /api/orders` - Get user's orders

### Admin Only
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/orders/:id/status` - Update order status

### Superadmin Only
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Change user role
- `DELETE /api/users/:id` - Delete user

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT, bcrypt
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Validation:** express-validator

## Project Structure

```
├── models/          # MongoDB schemas
├── controllers/     # Route handlers
├── routes/          # API routes
├── middleware/      # Auth & validation
├── public/          # Frontend files
└── server.js        # Entry point
```




### Reviews Endpoints

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| **POST** | `/api/reviews` | Create new review | productId, author, rating, comment |
| **GET** | `/api/reviews` | Get all reviews | - |
| **GET** | `/api/reviews/:id` | Get single review by ID | - |
| **DELETE** | `/api/reviews/:id` | Delete review | - |

---

##  Testing with Postman

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

##  Admin Interface

Access the admin panel at: **http://localhost:3000/admin**

Features:
-  Test all API endpoints
-  View real-time responses
-  Create, read, update, delete products
-  Manage reviews
-  API health check
-  Dark/Light mode


---

##  Error Handling

### Status Codes
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error



---


---

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

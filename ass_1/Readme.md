# Assignment 1

## Description

This is a RESTful API built with Express.js for managing products. The API provides full CRUD (Create, Read, Update, Delete) functionality for product data, which is stored in a JSON file. Each product has an id, name, and price. The server also includes utility endpoints for testing server status and connectivity.

### Chosen Object: Product

A **Product** represents an item in an inventory system with the following properties:
- `id` (number): Unique identifier generated using timestamp
- `name` (string): The name of the product
- `price` (number): The price of the product in currency units

## Installation

### Prerequisites
- Node.js v.24.11.1
- npm (Node Package Manager)

### Steps to Install Dependencies

1. Navigate to the project directory:
```bash
cd "C:\Users\Lenovo\Desktop\Web Technologies 2\ass_1"
```

2. Install required dependencies:
```bash
npm install express
```

Alternatively, if you have a `package.json` file in the directory:
```bash
npm install
```

## How to Run the Server

1. Start the server by running:
```bash
node server.js
```

2. The server will start on port **7777**. You should see the message:
```
Server is running on http://localhost:7777
```

3. The server is now ready to accept requests at `http://localhost:7777`

## API Routes

### Utility Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Returns a message confirming the server is running |
| GET | `/hello` | Returns a JSON greeting message |
| GET | `/time` | Returns the current server date |
| GET | `/status` | Returns server status with OK response |

### Product Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/products` | Retrieve all products |
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update an existing product by ID |
| DELETE | `/products/:id` | Delete a product by ID |

## API Documentation

### 1. Get All Products
**GET** `/products`

Returns a list of all products.

**Response:**
```json
[
  {
      "id": 1765821531904,
      "name": "Laptop",
      "price": 2000
    },
    {
      "id": 1765823164041,
      "name": "Mouse",
      "price": 5445
    },
    {
      "id": 1765881673321,
      "name": "Samsung",
      "price": 77777
    },
    {
      "id": 1765881858553,
      "name": "PC",
      "price": 450000
    }
]
```

### 2. Create a Product
**POST** `/products`

Creates a new product.

**Request Body:**
```json
{
      "id": 1765881858553,
      "name": "PC",
      "price": 450000
    }
```

**Response (201 Created):**
```json
{
    "Product added successfully": {
        "id": 1765881858553,
        "name": "PC",
        "price": 450000
    }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Product name is required"
}
```

### 3. Update a Product
**PUT** `/products/:id`

Updates an existing product by ID.

**Request Body:**
```json
{
    "name": "Mouse",
    "price": 5445
}
```

**Response (200 OK):**
```json
{
    "message": "Product updated successfully",
    "product": {
        "id": 1765823164041,
        "name": "Mouse",
        "price": 5445
    }
```

**Error Response (404 Not Found):**
```json
{
  "message": "Product not found"
}
```

### 4. Delete a Product
**DELETE** `/products/:id`

Deletes a product by ID.

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Product not found"
}
```




### Using cURL

#### Get All Products
```bash
curl http://localhost:7777/products
```

#### Create a Product
```bash
curl -X POST http://localhost:7777/products -H "Content-Type: application/json" -d "{\"name\":\"PC\",\"price\":450000}"
```

#### Update a Product
```bash
curl -X PUT http://localhost:7777/products/1765821531904 -H "Content-Type: application/json" -d "{\"name\":\"Mouse\",\"price\":5445}"
```

#### Delete a Product
```bash
curl -X DELETE http://localhost:7777/products/1765825390973
```

## Data Storage

Product data is stored in `data.json` file in the following format:
```json
{
  "products": [
    {
      "id": 1765821531904,
      "name": "Laptop",
      "price": 2000
    }
  ]
}
```

## Notes

- Product IDs are automatically generated using `Date.now()` timestamp
- All product data persists in the `data.json` file
- The server runs on port **7777** by default

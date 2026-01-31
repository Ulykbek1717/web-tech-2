# Postman Testing Guide - ShopLite API

## First, start the server!
```powershell
npm start
```
The server should be running at http://localhost:3000

---

## 1. HEALTH CHECK (API Status Check)

### GET - Check API Status
```
URL: http://localhost:3000/api/health
Method: GET
Body: not required
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "ShopLite API is running",
  "database": "Connected"
}
```

---

## 2. PRODUCTS

### POST - Create Product #1 (iPhone)
```
URL: http://localhost:3000/api/products
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "iPhone 17 Pro Max",
  "price": 499999,
  "description": "Latest flagship smartphone with advanced features and excellent camera",
  "category": "electronics",
  "imageUrl": "https://cdn0.it4profit.com/s3size/el:t/rt:fill/w:900/plain/s3://cms/product/3f/6d/3f6d9919916a6b670582e90692a99c5a/250915140014016549.webp",
  "stock": 50
}
```

### POST - Create Product #2 (Laptop)
```
URL: http://localhost:3000/api/products
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "MacBook Air M3",
  "price": 599999,
  "description": "Ultra-thin laptop with M3 chip, 13 inches, 8GB RAM, 512GB SSD",
  "category": "electronics",
  "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
  "stock": 30
}
```

### POST - Create Product #3 (Headphones)
```
URL: http://localhost:3000/api/products
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "Wireless Headphones Pro",
  "price": 89999,
  "description": "Wireless headphones with active noise cancellation and 30 hours of battery life",
  "category": "electronics",
  "imageUrl": "https://www.belkin.com/dw/image/v2/BGBH_PRD/on/demandware.static/-/Sites-master-product-catalog-blk/default/dw3589d5bb/images/hi-res/6/6de48f1507953676_AUD009fqBK-soundform-engage-overear-enc-headphones-web-gallery-01.jpg",
  "stock": 100
}
```

### POST - Create Product #4 (Hoodie)
```
URL: http://localhost:3000/api/products
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "Men's Premium Hoodie",
  "price": 25000,
  "description": "Comfortable hoodie made of quality cotton, size L, black color",
  "category": "apparel",
  "imageUrl": "https://media.istockphoto.com/id/1177415728/photo/mens-black-blank-hoodie-template-from-two-sides-natural-shape-on-invisible-mannequin-for-your.jpg",
  "stock": 75
}
```

### GET - Get All Products
```
URL: http://localhost:3000/api/products
Method: GET
```

### GET - Get Products by Category
```
URL: http://localhost:3000/api/products?category=electronics
Method: GET
```

### GET - Get Single Product (replace PRODUCT_ID with actual ID from previous request)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Method: GET

Example: http://localhost:3000/api/products/678a1b2c3d4e5f6789abcdef
```
**How to get PRODUCT_ID:**
1. Make a GET request to `/api/products`
2. Copy the `_id` value of any product
3. Insert it into the URL instead of PRODUCT_ID

### PUT - Update Product (replace PRODUCT_ID)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Method: PUT
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "iPhone 17 Pro Max - Updated",
  "price": 449999,
  "description": "Updated product description with discount",
  "category": "electronics",
  "stock": 45
}
```

### DELETE - Delete Product (replace PRODUCT_ID)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Method: DELETE
```

---

## 3. REVIEWS

### POST - Create Review #1 (replace PRODUCT_ID with actual product ID)
```
URL: http://localhost:3000/api/reviews
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Alexey Ivanov",
  "rating": 5,
  "comment": "Excellent product! Very satisfied with the purchase. Recommend to everyone!"
}
```

### POST - Create Review #2
```
URL: http://localhost:3000/api/reviews
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Maria Petrova",
  "rating": 4,
  "comment": "Good product, but a bit expensive. Overall quality is decent."
}
```

### POST - Create Review #3
```
URL: http://localhost:3000/api/reviews
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Dmitry Sidorov",
  "rating": 3,
  "comment": "Okay, but expected more for this price. Delivery took a long time."
}
```

### GET - Get All Reviews
```
URL: http://localhost:3000/api/reviews
Method: GET
```

### GET - Get Reviews for Specific Product
```
URL: http://localhost:3000/api/reviews?productId=PRODUCT_ID
Method: GET
```

### GET - Get Single Review (replace REVIEW_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Method: GET
```

### PUT - Update Review (replace REVIEW_ID and PRODUCT_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Method: PUT
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Alexey Ivanov (updated)",
  "rating": 5,
  "comment": "Updated review: product is truly excellent!"
}
```

### DELETE - Delete Review (replace REVIEW_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Method: DELETE
```

---

## 4. STEP-BY-STEP INSTRUCTIONS

### Step 1: Check API
1. Open Postman
2. Create a new request
3. Select method: **GET**
4. URL: `http://localhost:3000/api/health`
5. Click **Send**
6. Should return status 200 OK

### Step 2: Create First Product
1. Create a new request
2. Method: **POST**
3. URL: `http://localhost:3000/api/products`
4. Go to **Headers** tab
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab
6. Select **raw** and **JSON**
7. Copy the JSON for iPhone (see above)
8. Click **Send**
9. **IMPORTANT:** Copy the `_id` value from the response!

### Step 3: Get All Products
1. New request
2. Method: **GET**
3. URL: `http://localhost:3000/api/products`
4. Click **Send**
5. You'll see all created products

### Step 4: Create a Review
1. Copy the product `_id` from the previous request
2. New POST request to `/api/reviews`
3. In Body, replace `PRODUCT_ID` with the copied `_id`
4. Click **Send**

### Step 5: Update Product
1. Copy the product `_id`
2. New PUT request to `http://localhost:3000/api/products/INSERT_ID_HERE`
3. In Body, specify new data
4. Click **Send**

### Step 6: Delete Product
1. New DELETE request to `http://localhost:3000/api/products/INSERT_ID_HERE`
2. Click **Send**

---

## 5. COMMON ERRORS

### Error 400 - Validation failed
**Cause:** Incorrect data
**Solution:** Check that all required fields are filled:
- name (minimum 3 characters)
- price (number >= 0)
- description (minimum 10 characters)
- category (only: electronics, apparel, home, other)

### Error 404 - Not Found
**Cause:** Incorrect product/review ID
**Solution:** Check that the ID exists (make a GET request)

### Error 500 - Server Error
**Cause:** Database connection issue
**Solution:** Check MongoDB Atlas connection

---

## 6. QUICK TEST (complete sequence)

Execute in order:

1. ✅ GET `/api/health` - check API
2. ✅ POST `/api/products` - create iPhone (save ID)
3. ✅ POST `/api/products` - create Laptop (save ID)
4. ✅ GET `/api/products` - get all products
5. ✅ GET `/api/products/:id` - get single product
6. ✅ POST `/api/reviews` - create review for iPhone
7. ✅ GET `/api/reviews` - get all reviews
8. ✅ PUT `/api/products/:id` - update iPhone
9. ✅ DELETE `/api/reviews/:id` - delete review
10. ✅ DELETE `/api/products/:id` - delete Laptop

---

## 7. POSTMAN SETUP

### Create Collection (recommended)
1. In Postman click **New Collection**
2. Name it: "ShopLite API"
3. Create folders:
   - Health Check
   - Products
   - Reviews
4. Add requests to corresponding folders

### Use Variables (advanced level)
1. Create environment "ShopLite Local"
2. Add variable:
   - `base_url` = `http://localhost:3000/api`
3. Use in requests: `{{base_url}}/products`

---

## 8. RESPONSE EXAMPLES

### Successful Product Creation (201)
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "678a1b2c3d4e5f6789abcdef",
    "name": "iPhone 17 Pro Max",
    "price": 499999,
    "description": "Latest flagship smartphone...",
    "category": "electronics",
    "stock": 50,
    "createdAt": "2026-01-17T10:00:00.000Z",
    "updatedAt": "2026-01-17T10:00:00.000Z"
  }
}
```

### Validation Error (400)
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

### Product Not Found (404)
```json
{
  "error": {
    "message": "Product not found",
    "status": 404
  }
}
```

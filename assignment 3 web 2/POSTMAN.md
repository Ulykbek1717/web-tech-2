# Postman Testing Guide - ShopLite API

## Сначала запусти сервер!
```powershell
npm start
```
Сервер должен работать на http://localhost:3000

---

## 1. HEALTH CHECK (Проверка API)

### GET - Проверить статус API
```
URL: http://localhost:3000/api/health
Метод: GET
Body: не нужен
```

**Ожидаемый ответ:**
```json
{
  "status": "OK",
  "message": "ShopLite API is running",
  "database": "Connected"
}
```

---

## 2. PRODUCTS - Товары

### POST - Создать товар №1 (iPhone)
```
URL: http://localhost:3000/api/products
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "iPhone 17 Pro Max",
  "price": 499999,
  "description": "Последний флагманский смартфон с продвинутыми функциями и отличной камерой",
  "category": "electronics",
  "imageUrl": "https://cdn0.it4profit.com/s3size/el:t/rt:fill/w:900/plain/s3://cms/product/3f/6d/3f6d9919916a6b670582e90692a99c5a/250915140014016549.webp",
  "stock": 50
}
```

### POST - Создать товар №2 (Laptop)
```
URL: http://localhost:3000/api/products
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "MacBook Air M3",
  "price": 599999,
  "description": "Ультратонкий ноутбук с чипом M3, 13 дюймов, 8GB RAM, 512GB SSD",
  "category": "electronics",
  "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
  "stock": 30
}
```

### POST - Создать товар №3 (Headphones)
```
URL: http://localhost:3000/api/products
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "Wireless Headphones Pro",
  "price": 89999,
  "description": "Беспроводные наушники с активным шумоподавлением и 30 часами работы",
  "category": "electronics",
  "imageUrl": "https://www.belkin.com/dw/image/v2/BGBH_PRD/on/demandware.static/-/Sites-master-product-catalog-blk/default/dw3589d5bb/images/hi-res/6/6de48f1507953676_AUD009fqBK-soundform-engage-overear-enc-headphones-web-gallery-01.jpg",
  "stock": 100
}
```

### POST - Создать товар №4 (Hoodie)
```
URL: http://localhost:3000/api/products
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "Men's Premium Hoodie",
  "price": 25000,
  "description": "Удобная толстовка из качественного хлопка, размер L, цвет черный",
  "category": "apparel",
  "imageUrl": "https://media.istockphoto.com/id/1177415728/photo/mens-black-blank-hoodie-template-from-two-sides-natural-shape-on-invisible-mannequin-for-your.jpg",
  "stock": 75
}
```

### GET - Получить все товары
```
URL: http://localhost:3000/api/products
Метод: GET
```

### GET - Получить товары по категории
```
URL: http://localhost:3000/api/products?category=electronics
Метод: GET
```

### GET - Получить один товар (замени PRODUCT_ID на реальный ID из предыдущего запроса)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Метод: GET

Пример: http://localhost:3000/api/products/678a1b2c3d4e5f6789abcdef
```
**Как получить PRODUCT_ID:**
1. Сделай GET запрос на `/api/products`
2. Скопируй значение `_id` любого товара
3. Вставь в URL вместо PRODUCT_ID

### PUT - Обновить товар (замени PRODUCT_ID)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Метод: PUT
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "name": "iPhone 17 Pro Max - Updated",
  "price": 449999,
  "description": "Обновленное описание товара со скидкой",
  "category": "electronics",
  "stock": 45
}
```

### DELETE - Удалить товар (замени PRODUCT_ID)
```
URL: http://localhost:3000/api/products/PRODUCT_ID
Метод: DELETE
```

---

## 3. REVIEWS - Отзывы

### POST - Создать отзыв №1 (замени PRODUCT_ID на реальный ID товара)
```
URL: http://localhost:3000/api/reviews
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Алексей Иванов",
  "rating": 5,
  "comment": "Отличный товар! Очень доволен покупкой. Рекомендую всем!"
}
```

### POST - Создать отзыв №2
```
URL: http://localhost:3000/api/reviews
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Мария Петрова",
  "rating": 4,
  "comment": "Хороший продукт, но немного дороговато. В целом качество на уровне."
}
```

### POST - Создать отзыв №3
```
URL: http://localhost:3000/api/reviews
Метод: POST
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Дмитрий Сидоров",
  "rating": 3,
  "comment": "Нормально, но ожидал большего за эту цену. Доставка заняла много времени."
}
```

### GET - Получить все отзывы
```
URL: http://localhost:3000/api/reviews
Метод: GET
```

### GET - Получить отзывы для конкретного товара
```
URL: http://localhost:3000/api/reviews?productId=PRODUCT_ID
Метод: GET
```

### GET - Получить один отзыв (замени REVIEW_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Метод: GET
```

### PUT - Обновить отзыв (замени REVIEW_ID и PRODUCT_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Метод: PUT
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "productId": "PRODUCT_ID",
  "author": "Алексей Иванов (обновлено)",
  "rating": 5,
  "comment": "Обновил отзыв: товар действительно превосходный!"
}
```

### DELETE - Удалить отзыв (замени REVIEW_ID)
```
URL: http://localhost:3000/api/reviews/REVIEW_ID
Метод: DELETE
```

---

## 4. ПОШАГОВАЯ ИНСТРУКЦИЯ

### Шаг 1: Проверь API
1. Открой Postman
2. Создай новый запрос
3. Выбери метод: **GET**
4. URL: `http://localhost:3000/api/health`
5. Нажми **Send**
6. Должен вернуться статус 200 OK

### Шаг 2: Создай первый товар
1. Создай новый запрос
2. Метод: **POST**
3. URL: `http://localhost:3000/api/products`
4. Перейди на вкладку **Headers**
   - Key: `Content-Type`
   - Value: `application/json`
5. Перейди на вкладку **Body**
6. Выбери **raw** и **JSON**
7. Скопируй JSON для iPhone (см. выше)
8. Нажми **Send**
9. **ВАЖНО:** Скопируй значение `_id` из ответа!

### Шаг 3: Получи все товары
1. Новый запрос
2. Метод: **GET**
3. URL: `http://localhost:3000/api/products`
4. Нажми **Send**
5. Увидишь все созданные товары

### Шаг 4: Создай отзыв
1. Скопируй `_id` товара из предыдущего запроса
2. Новый запрос POST на `/api/reviews`
3. В Body замени `PRODUCT_ID` на скопированный `_id`
4. Нажми **Send**

### Шаг 5: Обнови товар
1. Скопируй `_id` товара
2. Новый запрос PUT на `http://localhost:3000/api/products/ВСТАВЬ_ID_СЮДА`
3. В Body укажи новые данные
4. Нажми **Send**

### Шаг 6: Удали товар
1. Новый запрос DELETE на `http://localhost:3000/api/products/ВСТАВЬ_ID_СЮДА`
2. Нажми **Send**

---

## 5. ТИПИЧНЫЕ ОШИБКИ

### Ошибка 400 - Validation failed
**Причина:** Неправильные данные
**Решение:** Проверь, что все обязательные поля заполнены:
- name (минимум 3 символа)
- price (число >= 0)
- description (минимум 10 символов)
- category (только: electronics, apparel, home, other)

### Ошибка 404 - Not Found
**Причина:** Неправильный ID товара/отзыва
**Решение:** Проверь, что ID существует (сделай GET запрос)

### Ошибка 500 - Server Error
**Причина:** Проблема с базой данных
**Решение:** Проверь подключение к MongoDB Atlas

---

## 6. БЫСТРЫЙ ТЕСТ (вся последовательность)

Выполни по порядку:

1. ✅ GET `/api/health` - проверка API
2. ✅ POST `/api/products` - создай iPhone (сохрани ID)
3. ✅ POST `/api/products` - создай Laptop (сохрани ID)
4. ✅ GET `/api/products` - получи все товары
5. ✅ GET `/api/products/:id` - получи один товар
6. ✅ POST `/api/reviews` - создай отзыв для iPhone
7. ✅ GET `/api/reviews` - получи все отзывы
8. ✅ PUT `/api/products/:id` - обнови iPhone
9. ✅ DELETE `/api/reviews/:id` - удали отзыв
10. ✅ DELETE `/api/products/:id` - удали Laptop

---

## 7. НАСТРОЙКА POSTMAN

### Создай коллекцию (рекомендуется)
1. В Postman нажми **New Collection**
2. Назови: "ShopLite API"
3. Создай папки:
   - Health Check
   - Products
   - Reviews
4. Добавляй запросы в соответствующие папки

### Используй переменные (продвинутый уровень)
1. Создай environment "ShopLite Local"
2. Добавь переменную:
   - `base_url` = `http://localhost:3000/api`
3. Используй в запросах: `{{base_url}}/products`

---

## 8. ПРИМЕРЫ ОТВЕТОВ

### Успешное создание товара (201)
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "678a1b2c3d4e5f6789abcdef",
    "name": "iPhone 17 Pro Max",
    "price": 499999,
    "description": "Последний флагманский смартфон...",
    "category": "electronics",
    "stock": 50,
    "createdAt": "2026-01-17T10:00:00.000Z",
    "updatedAt": "2026-01-17T10:00:00.000Z"
  }
}
```

### Ошибка валидации (400)
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

### Товар не найден (404)
```json
{
  "error": {
    "message": "Product not found",
    "status": 404
  }
}
```

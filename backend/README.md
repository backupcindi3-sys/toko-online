# Fashion Store Backend API

API RESTful untuk aplikasi fashion store dengan autentikasi admin menggunakan JWT.

## Instalasi

```bash
npm install
```

## Konfigurasi

1. Pastikan MongoDB sudah berjalan di local (port 27017)
2. File `.env` sudah tersedia dengan konfigurasi:
   - `PORT=5000`
   - `MONGODB_URI=mongodb://localhost:27017/fashion-store`
   - `JWT_SECRET=your_jwt_secret_key_change_this_in_production`
   - `NODE_ENV=development`

## Menjalankan Server

### Development (dengan hot reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server akan jalan di `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}

Response:
{
  "message": "User berhasil didaftarkan",
  "user": {
    "_id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Get Profile (Protected)
```
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "message": "Profil user",
  "user": {
    "_id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Product Routes

#### Get All Products
```
GET /api/products

Response:
{
  "message": "Daftar semua produk",
  "count": 5,
  "products": [...]
}
```

#### Get Product by ID
```
GET /api/products/:id

Response:
{
  "message": "Detail produk",
  "product": {
    "_id": "...",
    "name": "Kemeja Casual",
    "category": "Kemeja",
    "price": 150000,
    ...
  }
}
```

#### Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Kemeja Casual",
  "category": "Kemeja",
  "price": 150000,
  "image": "https://example.com/image.jpg",
  "description": "Kemeja casual berkualitas tinggi",
  "rating": 4.5,
  "reviews": 10,
  "color": "Biru",
  "size": ["S", "M", "L", "XL"],
  "stock": 50
}

Response:
{
  "message": "Produk berhasil dibuat",
  "product": {...}
}
```

#### Update Product (Admin Only)
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 160000,
  "stock": 45
}

Response:
{
  "message": "Produk berhasil diperbarui",
  "product": {...}
}
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:id
Authorization: Bearer <token>

Response:
{
  "message": "Produk berhasil dihapus",
  "product": {...}
}
```

## Struktur Project

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js        // Schema untuk user dengan bcrypt
│   │   └── Product.js     // Schema untuk produk
│   ├── controllers/
│   │   ├── authController.js      // Logic untuk auth
│   │   └── productController.js   // Logic untuk product CRUD
│   ├── routes/
│   │   ├── auth.js        // Auth routes
│   │   └── product.js     // Product routes
│   ├── middleware/
│   │   └── auth.js        // JWT verification middleware
│   └── index.js           // Main server file
├── package.json
├── .env                   // Environment variables
├── .env.example           // Example environment
└── .gitignore
```

## Autentikasi

- Setiap request yang butuh admin harus include header:
  ```
  Authorization: Bearer <jwt_token>
  ```
- Token diperoleh dari endpoint `/auth/login`
- Token berlaku selama 7 hari
- Route yang butuh autentikasi: POST/PUT/DELETE product endpoints

## Error Handling

Semua error akan mengembalikan JSON response dengan format:
```json
{
  "message": "Deskripsi error",
  "error": "Detail error"
}
```

## Notes

- Password di-hash menggunakan bcryptjs (10 salt rounds)
- MongoDB timestamps otomatis untuk created_at dan updated_at
- Produk memiliki 10 kategori yang tersedia:
  - Kemeja, Celana, Dress, Jaket, Blouse, Shorts, Sweater, Skirt, Polo, Cardigan

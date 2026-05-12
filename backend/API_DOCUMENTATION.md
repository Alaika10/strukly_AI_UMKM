# Dokumentasi API - Strukly AI UMKM

Dokumentasi ini berisi daftar endpoint yang tersedia pada backend untuk digunakan oleh tim frontend.

**Base URL:** `http://localhost:5000`

---

## 🚀 Persiapan Postman
Untuk memudahkan pengujian, silakan gunakan file berikut yang ada di folder root project:
1.  **FinanceApp.postman_collection.json**: Koleksi lengkap semua request API.
2.  **FinanceApp.postman_environment.json**: Variabel environment (baseUrl, accessToken, dll).

---

## 1. Authentication (`/api/auth`)

### Register
`POST /api/auth/register`
- **Body:** `{ name, email, password }`
- **Response Example:**
```json
{
  "user": { "id": 1, "name": "User", "email": "user@example.com" },
  "token": "eyJhbG..."
}
```

### Login
`POST /api/auth/login`
- **Body:** `{ email, password }`
- **Response:** Sama seperti Register.

### Forgot Password
`POST /api/auth/forgot-password`
- **Body:** `{ email, new_password }`
- **Response:** `{ "message": "Password berhasil diubah" }`

---

## 2. Transactions (`/api/transactions`)
*Memerlukan header: `Authorization: Bearer <token>`*

### Create Manual
`POST /api/transactions/`
- **Body:** `{ amount, category_id, merchant, transaction_date, type }` (type: 'income' atau 'expense')
- **Response:** Object transaksi yang dibuat + notifikasi otomatis.

### Create From OCR (Smart Scan)
`POST /api/transactions/ocr`
- **Body:** Form-data dengan key `file` (image).
- **Response:** Data hasil scan & record transaksi.

### Get All Transactions
`GET /api/transactions/`
- **Response:** Array of transactions.

### Update Transaction
`PUT /api/transactions/:id`
- **Body:** `{ amount, category_id, merchant, ... }`

### Delete Transaction
`DELETE /api/transactions/:id`

---

## 3. Dashboard & Analytics (`/api`)
*Memerlukan header: `Authorization: Bearer <token>`*

### Summary Dashboard
`GET /api/dashboard/summary`
- **Response Example:**
```json
{
  "total_income": 12450000,
  "total_expense": 4210000,
  "balance": 8240000
}
```

### Tax Calculation
`GET /api/tax/`
- **Response:** Estimasi pajak PPh Final 0.5%.

### Risk Analysis
`GET /api/risk/`
- **Response:** Analisis risiko keuangan.

### Forecast
`GET /api/forecast/`
- **Response:** Prediksi keuangan ke depan.

### Insights
`GET /api/insight/`
- **Response:** Rekomendasi bisnis berbasis AI.

---

## 4. Settings & Profile (`/api/settings`)
*Memerlukan header: `Authorization: Bearer <token>`*

### Get Profile & Settings
`GET /api/settings/profile`
- **Response:** Data user lengkap termasuk `business_name`, `logo_url`, `two_factor_enabled`, dll.

### Update Business Profile
`PUT /api/settings/profile`
- **Body:** `{ name, business_name, business_category, logo_url }`

### Update Security
`PUT /api/settings/security`
- **Body:** `{ current_password, new_password, two_factor_enabled }`

### Update Notification Settings
`PUT /api/settings/notifications`
- **Body:** `{ notif_stock_reminder, notif_daily_summary, notif_tax_reminder, notif_monthly_report }` (Boolean)

---

## 5. Notifications (`/api/notifications`)
*Memerlukan header: `Authorization: Bearer <token>`*

### Get Notifications (Dropdown List)
`GET /api/notifications/`
- **Response:** Array of notifications yang tersimpan di database.

### Mark Notification as Read
`PUT /api/notifications/read/:id`
- **Response:** Object notifikasi yang telah diupdate (`is_read: true`).

---

## 6. Alerts (`/api/alert`)
*Memerlukan header: `Authorization: Bearer <token>`*

### Get Dynamic Alerts
`GET /api/alert/`
- **Response:** Alert dinamis berbasis kondisi finansial (Danger/Warning/Success).

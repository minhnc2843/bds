# 🏠 BĐSViệt — Nền tảng Bất Động Sản Cao Cấp

Website mua bán & cho thuê bất động sản full-stack với giao diện sang trọng tối & gold.

---

## 🛠️ Tech Stack

| Thành phần   | Công nghệ                                    |
|-------------|----------------------------------------------|
| Backend     | Laravel 12, Laravel Sanctum, Laravel Reverb  |
| Frontend    | React 18, Vite, Tailwind CSS                 |
| Database    | MySQL (phpMyAdmin)                           |
| Realtime    | Laravel Reverb (WebSocket)                  |
| Search      | Meilisearch + Laravel Scout                  |
| State       | Zustand, TanStack React Query                |
| UI          | Swiper, React Icons, React Hot Toast         |

---

## 📁 Cấu trúc dự án

```
/
├── bds-api/          # Laravel 12 Backend
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Events/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── bds-frontend/     # React + Vite Frontend
    ├── src/
    │   ├── api/          # Axios config
    │   ├── components/   # UI Components
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Trang chính + Admin
    │   ├── store/        # Zustand stores
    │   └── utils/        # Format helpers
    └── index.html
```

---

## 🗄️ Database Schema

```
users             → Tài khoản người dùng & admin
categories        → Loại BĐS (căn hộ, studio...)
provinces         → Tỉnh/Thành phố
listings          → Tin đăng BĐS (bảng chính)
listing_images    → Ảnh của từng tin đăng
favorites         → Tin yêu thích của user
contacts          → Yêu cầu liên hệ xem nhà
notifications     → Thông báo realtime
site_settings     → Cài đặt website (CMS)
banners           → Banner slideshow trang chủ
promotions        → Chương trình khuyến mãi
post_categories   → Danh mục bài viết
posts             → Bài viết blog/tin tức
pages             → Trang tĩnh (Giới thiệu, CSBT...)
contact_messages  → Tin nhắn liên hệ từ khách
```

---

## ✨ Tính năng

### 👤 Người dùng
- Đăng ký / Đăng nhập / Đăng xuất
- Cập nhật thông tin cá nhân, đổi mật khẩu
- Upload ảnh đại diện
- Đăng tin BĐS (mua bán / cho thuê)
- Upload nhiều ảnh, chọn ảnh đại diện
- Quản lý tin đăng của mình (sửa, xóa)
- Nhận thông báo realtime khi tin được duyệt/từ chối
- Trang thông báo với badge đếm chưa đọc

### 🔍 Tìm kiếm
- Full-text search với Meilisearch
- Autocomplete / gợi ý khi gõ
- Tìm kiếm kết hợp: từ khóa + loại + tỉnh thành + giá + diện tích + số phòng ngủ
- Facets thông minh (số lượng theo từng filter)
- BĐS tương tự trong trang chi tiết
- Sắp xếp: mới nhất, giá tăng/giảm, diện tích

### 🏠 Trang chủ
- Hero banner slideshow (Swiper, hiệu ứng fade)
- Thanh tìm kiếm nổi bật trên hero
- Thống kê: tổng tin, giao dịch, đánh giá
- Chương trình khuyến mãi
- Danh sách tin nổi bật (tab: Tất cả / Mua bán / Cho thuê)
- Section "Tại sao chọn chúng tôi"

### 📰 Blog & Nội dung
- Danh sách bài viết với filter theo danh mục
- Trang chi tiết bài viết với bài liên quan
- Share Facebook, copy link
- Đếm lượt xem
- Trang tĩnh: Giới thiệu, Điều khoản, Chính sách bảo mật
- Trang Liên hệ với form gửi tin nhắn

### 🛠️ Admin CMS
- Dashboard thống kê tổng quan
- Quản lý tin đăng: duyệt / từ chối / xóa
- Quản lý người dùng: khóa / mở khóa / xóa
- **Banner CMS**: thêm/sửa/ẩn/xóa banner slideshow
- **Promotion CMS**: tạo/xóa chương trình khuyến mãi
- **Site Settings**: cập nhật logo, favicon, tên web, slogan, địa chỉ, hotline, email, mạng xã hội, SEO
- **Bài viết**: tạo/sửa/xóa bài viết blog
- **Trang tĩnh**: chỉnh sửa nội dung HTML
- **Tin nhắn liên hệ**: xem, ghi chú, đánh dấu trạng thái

### ⚡ Realtime (Laravel Reverb)
- Admin nhận thông báo ngay khi có tin đăng mới
- User nhận thông báo ngay khi tin được duyệt/từ chối
- Badge số thông báo cập nhật tức thời

---

## 🚀 Hướng dẫn chạy dự án

### Yêu cầu
- Windows + Laragon (PHP 8.2+, MySQL, Apache)
- Node.js 18+
- Composer
- Git

---

### 1. Clone dự án

```bash
git clone https://github.com/your-username/bdsviet.git
cd bdsviet
```

---

### 2. Cài đặt Backend

```bash
cd bds-api
composer install
cp .env.example .env
php artisan key:generate
```

Cấu hình `.env`:
```env
DB_DATABASE=bds_db
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_CONNECTION=reverb
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

Tạo database `bds_db` trong phpMyAdmin, sau đó:

```bash
php artisan migrate
php artisan db:seed --class=CategoryProvinceSeeder
php artisan db:seed --class=SiteSettingsSeeder
php artisan db:seed --class=PostCategorySeeder
php artisan db:seed --class=PageSeeder
php artisan storage:link
```

Tạo tài khoản Admin:
```bash
php artisan tinker
App\Models\User::create([
  'name'     => 'Super Admin',
  'email'    => 'admin@bds.com',
  'password' => bcrypt('admin123456'),
  'role'     => 'admin',
]);
exit
```

---

### 3. Cài đặt Frontend

```bash
cd ../bds-frontend
npm install
```

---

### 4. Cài & chạy Meilisearch

> ⚠️ File `meilisearch.exe` KHÔNG được commit vào git vì vượt giới hạn 100MB.
> Tải thủ công theo hướng dẫn dưới đây.

**Tải Meilisearch:**
1. Truy cập: https://github.com/meilisearch/meilisearch/releases/latest
2. Tải file `meilisearch-windows-amd64.exe`
3. Đổi tên thành `meilisearch.exe`
4. Đặt vào thư mục `bds-api/`

**Chạy Meilisearch:**
```bash
cd bds-api
./meilisearch.exe --master-key="masterKey"
```

### 5. Chạy dự án (cần 3 terminal)

```bash
# Terminal 1 — Meilisearch (giữ chạy)
./meilisearch.exe --master-key="masterKey"

# Terminal 2 — Laravel Reverb WebSocket
cd bds-api
php artisan reverb:start

# Terminal 3 — React Frontend
cd bds-frontend
npm run dev
```

Laravel chạy qua Laragon (Apache):
```
http://localhost/bds-api/public
```

---

### 6. Truy cập

| URL | Mô tả |
|-----|-------|
| `http://localhost:5173` | Trang chủ người dùng |
| `http://localhost:5173/admin` | Trang quản trị |
| `http://localhost/bds-api/public/api` | Laravel API |
| `http://127.0.0.1:7700` | Meilisearch Dashboard |

---

## 📡 API Endpoints tóm tắt

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  POST   /api/auth/logout

LISTINGS (public)
  GET    /api/listings
  GET    /api/listings/{id}

LISTINGS (auth)
  POST   /api/listings
  PUT    /api/listings/{id}
  DELETE /api/listings/{id}
  GET    /api/my-listings

SEARCH
  GET    /api/search
  GET    /api/search/suggest
  GET    /api/search/advanced
  GET    /api/search/similar/{id}

BLOG & PAGES
  GET    /api/posts
  GET    /api/posts/{slug}
  GET    /api/posts/categories
  GET    /api/pages/{slug}
  POST   /api/contact

PROFILE
  PUT    /api/profile
  PUT    /api/profile/password
  POST   /api/profile/avatar

NOTIFICATIONS
  GET    /api/notifications
  PATCH  /api/notifications/{id}/read
  PATCH  /api/notifications/read-all
  DELETE /api/notifications/{id}

SITE CONFIG
  GET    /api/site/config

ADMIN (auth + role=admin)
  GET    /api/admin/dashboard
  GET/PATCH/DELETE /api/admin/listings
  GET/PATCH/DELETE /api/admin/users
  GET/PUT  /api/admin/settings
  POST     /api/admin/settings/upload-image
  CRUD     /api/admin/banners
  CRUD     /api/admin/promotions
  CRUD     /api/admin/posts
  GET/PUT  /api/admin/pages
  GET/PATCH/DELETE /api/admin/contacts
```

---

## 👨‍💻 Tác giả

Dự án được xây dựng với sự hỗ trợ của Claude AI (Anthropic).

---

## 📝 License

MIT License

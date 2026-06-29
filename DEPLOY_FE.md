# Hướng Dẫn Deploy Frontend Lên Vercel (Monorepo Turborepo)

Tài liệu này hướng dẫn cách cấu hình, triển khai (deploy) và quản lý ứng dụng Frontend chính thức (`landing-page-aizen-frontend-ob6i`) trong cấu trúc Monorepo (sử dụng Turborepo + npm workspaces) lên nền tảng Vercel.

---

## 1. Thông Tin Dự Án Chính Thức
* **Tên dự án trên Vercel:** `landing-page-aizen-frontend-ob6i`
* **Repository GitHub:** `hoaibao3112/landing_page_aizen` (nhánh `main`)
* **Cơ chế hoạt động:** Khi đẩy mã nguồn lên nhánh `main`, Vercel sẽ tự động kích hoạt quá trình triển khai (deploy) cho dự án này.

---

## 2. Nguyên Tắc Hoạt Động Của Monorepo Trên Vercel

Dự án này sử dụng cấu trúc Monorepo:
- Thư mục gốc chứa các file cấu hình tổng (`package.json`, `package-lock.json`, `turbo.json`).
- Thư mục `apps/frontend` chứa mã nguồn Next.js Frontend.
- Thư mục `apps/backend` chứa NestJS Backend.
- Thư mục `packages/` chứa các thư viện dùng chung.

Để Vercel hiểu được các phụ thuộc (dependencies) chéo giữa các package, **quy trình build bắt buộc phải được chạy từ thư mục gốc của repository (`.`)**, chứ không phải chạy trực tiếp trong thư mục `apps/frontend`.

---

## 3. Cấu Hình Chuẩn Trên Vercel Dashboard

Truy cập **Vercel Project Dashboard** -> chọn dự án **`landing-page-aizen-frontend-ob6i`** -> **Settings** -> **Build & Development Settings**:

* **Framework Preset**: Chọn **Next.js**
* **Root Directory**: Chọn **`.`** (Thư mục gốc của toàn bộ repository).
* **Build Command**: Bật nút **Override** và điền:
  ```bash
  npx turbo run build --filter=@aizen/frontend
  ```
* **Output Directory**: Bật nút **Override** và điền:
  ```text
  apps/frontend/.next
  ```
* **Install Command**: Bật nút **Override** và điền:
  ```bash
  npm ci
  ```
  *(Sử dụng `npm ci` giúp cài đặt dependencies sạch và ổn định từ `package-lock.json` gốc, tránh lỗi xung đột cache `idealTree`)*

---

## 4. Xử Lý Trùng Lặp Dự Án (Tránh Lỗi Bị Xếp Hàng - Queued)

Nếu tài khoản Vercel của bạn có nhiều dự án cùng kết nối đến 1 repository GitHub, mỗi lần push code cả 4 dự án sẽ đồng loạt build. Với gói tài khoản cá nhân (Hobby), Vercel giới hạn chỉ được build 1 dự án tại 1 thời điểm, dẫn đến việc dự án chính bị kẹt ở trạng thái **Queued**.

### 🛠️ Cách dọn dẹp các dự án thừa:
Bạn chỉ nên giữ lại dự án chính **`landing-page-aizen-frontend-ob6i`** và xóa các dự án thử nghiệm khác (ví dụ: `landing_page_aizen`, `aizen-education`, `landing-page-aizen-frontend`):

1. Trên Vercel Dashboard, click chọn dự án thừa muốn xóa.
2. Truy cập tab **Settings** ở thanh menu trên cùng của dự án đó.
3. Cuộn xuống cuối trang cài đặt, tìm phần **Delete Project**.
4. Click nút **Delete** và nhập tên dự án để xác nhận xóa.
*(Lưu ý: Việc này chỉ xóa cấu hình deploy trên Vercel, không làm ảnh hưởng hay mất mát code trên máy của bạn hoặc trên GitHub).*

---

## 5. Cấu Hinh Git Email Trên Máy Cá Nhân

Vercel yêu cầu email của các commit phải khớp với email của thành viên trong dự án để tránh lỗi **Blocked**.

Mở Terminal/PowerShell tại thư mục dự án trên máy của bạn và chạy các lệnh:

1. **Kiểm tra email hiện tại:**
   ```powershell
   git config user.email
   ```
2. **Cập nhật lại email chính xác (khớp với Vercel/GitHub của bạn):**
   ```powershell
   git config --global user.email "baohoaitran3112@gmail.com"
   git config user.email "baohoaitran3112@gmail.com"
   ```
3. **Cập nhật Tên người dùng:**
   ```powershell
   git config --global user.name "hoaibao3112"
   ```

---

## 6. Đồng Bộ Các File Cấu Hình Trong Code

Dự án sử dụng tệp `vercel.json` để cấu hình dự phòng:

### File `apps/frontend/vercel.json`
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=@aizen/frontend",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && npm ci",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://aizen-education-api.onrender.com/api/:path*"
    }
  ]
}
```

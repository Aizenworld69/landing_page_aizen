# Hướng Dẫn Push Code và Quản Lý Remote Git

Tài liệu này giải thích cách quản lý các nguồn Git (Remote) trong dự án hiện tại, lý do xảy ra tình trạng "push code nhưng chưa cập nhật trên GitHub" và hướng dẫn các lệnh push code đúng chuẩn.

---

## 1. Mô Hình Git Hiện Tại Trong Dự Án
Dự án của bạn đang được cấu hình với **2 remote (nguồn)** khác nhau:

| Tên Remote | Địa Chỉ Repository (URL) | Ý Nghĩa / Mục Đích |
| :--- | :--- | :--- |
| **`origin`** | `https://github.com/hoaibao3112/landing_page_aizen.git` | Đây là **kho lưu trữ cá nhân (Fork)** của bạn. Khi bạn push lên đây, chỉ có tài khoản của bạn nhìn thấy trên repo cá nhân này. |
| **`upstream`** | `https://github.com/Aizenworld69/landing_page_aizen.git` | Đây là **kho lưu trữ gốc (Main Repo)** của công ty/tổ chức. Đây chính là trang GitHub bạn đang xem trên trình duyệt (`github.com/Aizenworld69/...`). |

---

## 2. Giải Thích Vấn Đề Gặp Phải
Khi bạn yêu cầu *"push code lên giúp tôi"*, hệ thống mặc định chạy lệnh:
```bash
git push origin main
```
Lệnh này chỉ đẩy code lên kho cá nhân `hoaibao3112/landing_page_aizen`. Do đó, khi bạn mở trang GitHub của tổ chức (`Aizenworld69/landing_page_aizen`), bạn sẽ **chưa thấy cập nhật**.

Để code xuất hiện trên trang chung của tổ chức, chúng ta cần push lên remote `upstream`:
```bash
git push upstream main
```

---

## 3. Hướng Dẫn Các Lệnh Git Chuẩn Cho Dự Án

### Bước 1: Kiểm tra trạng thái code hiện tại
Trước khi commit hay push, hãy luôn kiểm tra xem có những file nào thay đổi:
```bash
git status
```

### Bước 2: Lưu các thay đổi (Commit)
Nếu có file mới hoặc file chỉnh sửa, thực hiện add và commit:
```bash
git add .
git commit -m "prefix: nội dung commit bằng tiếng Anh"
# Ví dụ: fix: update admin auth redirect to dang-ky
```

### Bước 3: Push code lên GitHub

#### Trường hợp 1: Push lên kho cá nhân (Fork) để làm việc riêng hoặc tạo Pull Request sau này:
```bash
git push origin main
```

#### Trường hợp 2: Push trực tiếp lên kho chung của dự án (Nếu bạn có quyền ghi trực tiếp và muốn cập nhật ngay):
```bash
git push upstream main
```

---

## 4. Kiểm Tra Cấu Hình Remote
Bất cứ lúc nào bạn muốn kiểm tra xem dự án đang liên kết với những link GitHub nào, hãy gõ:
```bash
git remote -v
```
Kết quả hiển thị sẽ tương tự như sau:
```text
origin    https://github.com/hoaibao3112/landing_page_aizen.git (fetch)
origin    https://github.com/hoaibao3112/landing_page_aizen.git (push)
upstream  https://github.com/Aizenworld69/landing_page_aizen.git (fetch)
upstream  https://github.com/Aizenworld69/landing_page_aizen.git (push)
```

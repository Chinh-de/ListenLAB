🎯 Mục tiêu ứng dụng:
Xây dựng một trình phát âm thanh luyện nghe hiện đại, có giao diện trực quan, dễ sử dụng, hỗ trợ duyệt thư mục máy tính, phát các tệp âm thanh với đầy đủ chức năng điều khiển và tùy chỉnh, lưu lịch sử thư mục, và tối ưu cho làm việc đa nhiệm (chia đôi màn hình, giao diện dọc).

🧩 1. Cấu trúc giao diện chính (HTML + Tailwind)
📁 Sidebar bên trái – Cây thư mục
Cho phép chọn thư mục từ máy tính bằng showDirectoryPicker().

Hiển thị cấu trúc thư mục theo tree view, có thể:

Mở rộng hoặc thu gọn thư mục cha/con.

Hiện danh sách các file âm thanh (MP3, WAV…).

Chọn file bất kỳ để phát.

Các file được hiển thị theo thứ tự tên/tùy chỉnh.

🎵 Trình phát bên phải – Player view
Giao diện hiện đại, giống các web như Spotify, Apple Music, SoundCloud.

Thiết kế responsive dọc, ví dụ khi chia đôi màn hình, trình phát nằm dọc gọn gàng.

Các thành phần chính:

Thông tin bài đang phát (tên file, thời gian, ảnh minh họa nếu có).

Thanh điều khiển:

⏮ Prev / ⏯ Play/Pause / ⏭ Next

🔁 Repeat / 🔂 Repeat N times / 🔀 Shuffle

Tốc độ phát (0.5x → 2x)

Thanh tua thời gian

Các nút tua nhanh/lùi theo mốc (1/3/5/10/15s)

Âm lượng (slider)

Nút ? hiển thị hướng dẫn phím tắt

⚙️ 2. Tính năng chính
📂 Chọn thư mục phát âm thanh
Sử dụng File System Access API (window.showDirectoryPicker()).

Khi chọn thư mục:

Quét toàn bộ các file âm thanh.

Hiển thị trong sidebar (tree view).

Lưu đường dẫn vào localStorage làm thư mục gần đây.

Khi người dùng chọn lại thư mục gần đây:

Xin lại quyền nếu cần (getDirectoryHandle()).

Phát được luôn không cần chọn lại thủ công.

🎛 Phát âm thanh & điều khiển
Dùng thẻ <audio> kết hợp JavaScript điều khiển.

Các chức năng:

Phát / Dừng

Tua tới/lùi: theo các mốc 1, 3, 5, 10, 15 giây

Phím tắt mặc định:

← / →: tua 2 giây

Shift + ← / →: chuyển bài trước/sau

Điều chỉnh tốc độ phát:

Các mức: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x

Âm lượng: bằng thanh trượt hoặc phím +/-

Repeat modes:

Không lặp

Lặp bài hiện tại

Lặp lại N lần do người dùng chọn (hiện dialog input)

Phát ngẫu nhiên:

Đảo thứ tự danh sách file âm thanh.

🎹 3. Hỗ trợ phím tắt
Khi người dùng bấm phím, thực hiện chức năng tương ứng:

Phím	Chức năng
← / →	Tua lui/tới 2 giây
Shift + ← / →	Chuyển bài trước/sau
R	Bật/tắt chế độ lặp
S	Bật/tắt phát ngẫu nhiên
+ / -	Tăng / giảm âm lượng
1 / 3 / 5 / 0	Tua nhanh/lùi 1, 3, 5, 10, 15 giây (tuỳ nút bấm)
H	Mở popup hướng dẫn phím tắt

❓ 4. Popup hướng dẫn phím tắt
Nút ❓ nằm góc phải màn hình trình phát.

Khi bấm:

Hiện popup modal hiển thị bảng phím tắt và mô tả.

Cho phép người dùng đóng bằng ESC hoặc click ngoài.

🕓 5. Lưu trữ lịch sử thư mục (localStorage)
Mỗi khi chọn thư mục, lưu lại:

Tên / đường dẫn (hoặc serialized file handle nếu dùng FileSystemHandle)

Thời gian truy cập

Dữ liệu lưu trong localStorage, ví dụ:

json
Copy
Edit
[
  {
    "name": "Music/Toeic",
    "handle": serializedHandle,
    "time": "2025-07-12T10:00:00Z"
  }
]
Khi mở lại trang:

Hiển thị danh sách thư mục gần đây (dropdown/sidebar).

Cho phép chọn lại → xin quyền → hiển thị file ngay.

🧱 6. Kỹ thuật & công nghệ
Frontend:

HTML5

Tailwind CSS

Vanilla JavaScript

API quan trọng:

showDirectoryPicker() – để chọn thư mục

FileSystemDirectoryHandle – truy xuất tệp

localStorage – lưu thư mục gần đây

Giao diện:

Responsive theo chiều dọc (ưu tiên dùng ở chế độ chia đôi màn hình).

Có thể hiển thị tốt trên mobile, tablet, desktop.

Sử dụng layout: flex, grid, overflow-y-scroll cho danh sách dài.

📌 Ví dụ luồng sử dụng
Người dùng mở web → bấm "Chọn thư mục"

Duyệt thư mục → ứng dụng liệt kê các file nhạc

Bấm vào một file để phát → hiện trình phát bên phải

Dùng nút bấm hoặc phím để điều khiển:

Tua nhanh, chuyển bài, tăng giảm âm lượng...

Lần sau vào lại → chọn thư mục gần đây để phát nhanh.


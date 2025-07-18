# 🎵 ListenHUB - Trình phát âm thanh luyện nghe hiện đại
> Truy cập phiên bản demo trực tuyến tại [https://chinh-de.github.io/ListenLAB/](https://chinh-de.github.io/ListenLAB/)

![ListenHUB Logo](./listenHUB.png)

Một trình phát âm thanh web hiện đại, được thiết kế đặc biệt cho việc luyện nghe với giao diện trực quan, dễ sử dụng và đầy đủ tính năng điều khiển.

## ✨ Tính năng chính

### 🎯 Giao diện hiện đại
- **Thiết kế responsive** - Tối ưu cho desktop, tablet và mobile
- **Layout hai cột** - Sidebar duyệt thư mục + Player chính
- **Giao diện dọc** - Phù hợp cho làm việc đa nhiệm (chia đôi màn hình)
- **UI hiện đại** - Lấy cảm hứng từ Spotify, Apple Music

### 📁 Duyệt thư mục thông minh
- **Truy cập thư mục máy tính** - Sử dụng File System Access API
- **Hiển thị dạng cây thư mục** - Mở rộng/thu gọn thư mục con
- **Sắp xếp tự nhiên** - File được sắp xếp theo thứ tự logic (1, 2, 10 thay vì 1, 10, 2)
- **Hỗ trợ nhiều định dạng** - MP3, WAV, AAC, OGG, FLAC

### 🎵 Trình phát đầy đủ tính năng
- **Điều khiển cơ bản** - Play/Pause, Next/Previous
- **Tua thời gian chính xác** - Các nút tua ±1s, ±3s, ±5s, ±10s
- **Thanh tiến trình tương tác** - Click để nhảy đến vị trí bất kỳ
- **Điều chỉnh tốc độ** - Từ 0.5x đến 2x (hỗ trợ luyện nghe)
- **Âm lượng linh hoạt** - Thanh trượt và phím tắt

### 🔄 Chế độ phát nâng cao
- **Lặp lại thông minh** - Tắt lặp, lặp một bài, lặp N lần, lặp vô hạn
- **Phát ngẫu nhiên** - Đảo thứ tự playlist
- **Phát liên tục** - Tự động chuyển bài trong thư mục

### ⌨️ Phím tắt mạnh mẽ
- **← / →** - Tua lui/tới 2 giây
- **Shift + ← / →** - Chuyển bài trước/sau
- **Space** - Phát/Dừng
- **R** - Chế độ lặp lại
- **S** - Phát ngẫu nhiên
- **+ / -** - Tăng/giảm âm lượng
- **1, 3, 5, 0** - Tua nhanh theo mốc thời gian
- **H** - Hiển thị hướng dẫn

## 🚀 Cách sử dụng

### 1. Mở trình phát
Mở file `index.html` trong trình duyệt web hiện đại (Chrome, Edge, Firefox).

### 2. Chọn thư mục nhạc
1. Click nút **"Chọn thư mục"** trong sidebar
2. Chọn thư mục chứa file âm thanh từ máy tính
3. Ứng dụng sẽ quét và hiển thị tất cả file âm thanh

### 3. Phát nhạc
- Click vào file bất kỳ để bắt đầu phát
- Sử dụng các nút điều khiển hoặc phím tắt
- Điều chỉnh tốc độ phát cho phù hợp với mục đích luyện nghe

### 4. Tùy chỉnh trải nghiệm
- Sử dụng các chế độ lặp lại cho việc luyện nghe
- Điều chỉnh âm lượng theo môi trường
- Sử dụng phím tắt để điều khiển nhanh chóng

## 🛠️ Công nghệ sử dụng

### Frontend
- **HTML5** - Cấu trúc trang web
- **Tailwind CSS** - Framework CSS hiện đại
- **Vanilla JavaScript** - Logic ứng dụng
- **Font Awesome** - Biểu tượng

### API chính
- **File System Access API** - Truy cập thư mục máy tính
- **Web Audio API** - Điều khiển âm thanh
- **Intl.Collator** - Sắp xếp tự nhiên

### Tương thích trình duyệt
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Firefox 111+
- ✅ Safari 15.2+

## 📱 Responsive Design

### Desktop (≥1024px)
- Layout hai cột đầy đủ
- Sidebar 1/3 màn hình
- Player 2/3 màn hình
- Hiển thị đầy đủ tính năng

### Tablet (768px-1023px)
- Layout linh hoạt
- Có thể ẩn/hiện sidebar
- Tối ưu cho cảm ứng

### Mobile (≤767px)
- Layout một cột
- Sidebar có thể overlay
- Điều khiển được tối ưu cho ngón tay

## 🎹 Phím tắt chi tiết

| Phím | Chức năng | Mô tả |
|------|-----------|--------|
| `←` / `→` | Tua lui/tới 2s | Tua nhanh trong bài hát |
| `Shift + ←` / `→` | Bài trước/sau | Chuyển bài trong playlist |
| `Space` | Phát/Dừng | Điều khiển phát nhạc |
| `R` | Chế độ lặp | Chuyển đổi các chế độ lặp |
| `S` | Phát ngẫu nhiên | Bật/tắt shuffle |
| `+` / `-` | Âm lượng | Tăng/giảm âm lượng |
| `1` | Tua 1s | Tua nhanh/lùi 1 giây |
| `3` | Tua 3s | Tua nhanh/lùi 3 giây |
| `5` | Tua 5s | Tua nhanh/lùi 5 giây |
| `0` | Tua 10s | Tua nhanh/lùi 10 giây |
| `H` | Trợ giúp | Hiển thị hướng dẫn phím tắt |

## 🔧 Tùy chỉnh

### Tốc độ phát
- **0.5x** - Chậm, phù hợp cho người mới học
- **0.75x** - Hơi chậm, luyện nghe chi tiết
- **1x** - Tốc độ bình thường
- **1.25x** - Hơi nhanh, tiết kiệm thời gian
- **1.5x** - Nhanh, luyện phản xạ
- **2x** - Rất nhanh, ôn tập

### Chế độ lặp
- **Tắt lặp** - Phát hết playlist thì dừng
- **Lặp một bài** - Lặp lại bài hiện tại
- **Lặp N lần** - Lặp lại số lần tùy chỉnh
- **Lặp vô hạn** - Lặp playlist liên tục

## 🎯 Ứng dụng luyện nghe

### Học ngôn ngữ
- Lặp lại từng câu/đoạn để nghe rõ
- Tăng dần tốc độ khi đã quen
- Sử dụng tua chính xác để luyện phát âm

### Luyện thi TOEIC/IELTS
- Lặp lại các bài listening
- Điều chỉnh tốc độ phù hợp trình độ
- Tua nhanh/lùi để phân tích chi tiết

### Học nhạc
- Lặp lại đoạn nhạc để học thuộc
- Chậm lại để nghe rõ từng note
- Phát ngẫu nhiên để làm mới cảm giác

## 📁 Cấu trúc dự án

```
ListenHUB/
├── index.html          # Trang chính
├── script.js           # Logic ứng dụng
├── styles.css          # CSS tùy chỉnh
├── listenHUB.png       # Logo ứng dụng
├── detail.md           # Tài liệu chi tiết
└── README.md           # Hướng dẫn này
```

## 🐛 Xử lý lỗi

### Lỗi phổ biến
- **Trình duyệt không hỗ trợ**: Cập nhật lên phiên bản mới nhất
- **Không truy cập được thư mục**: Cấp quyền truy cập file system
- **File không phát được**: Kiểm tra định dạng file được hỗ trợ
- **Phím tắt không hoạt động**: Đảm bảo trang web đang được focus

### Giải pháp
1. Sử dụng trình duyệt Chrome/Edge phiên bản mới nhất
2. Cho phép truy cập file system khi được hỏi
3. Kiểm tra định dạng file (MP3, WAV, AAC, OGG, FLAC)
4. Click vào trang web trước khi sử dụng phím tắt

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho dự án:

1. Fork repository
2. Tạo branch mới cho tính năng
3. Commit và push thay đổi
4. Tạo Pull Request


## 👨‍💻 Tác giả

**Developed by chinhde**

- 🌐 GitHub: [github.com/Chinh-de](https://github.com/Chinh-de)
- 📧 Email: chinhde29@gmail.com
- 📱 Facebook: [facebook.com/ncd.de](https://www.facebook.com/ncd.de)

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star để ủng hộ!

---

# 🎵 ListenHUB - Modern Audio Player for Listening Practice

![ListenHUB Logo](./listenHUB.png)

A modern web-based audio player specifically designed for listening practice with an intuitive interface, easy-to-use controls, and comprehensive features.

## ✨ Key Features

### 🎯 Modern Interface
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Two-Column Layout** - Sidebar folder browser + Main player
- **Vertical Layout** - Perfect for multitasking (split-screen mode)
- **Modern UI** - Inspired by Spotify, Apple Music

### 📁 Smart Folder Navigation
- **Computer Folder Access** - Using File System Access API
- **Tree View Display** - Expand/collapse subfolders
- **Natural Sorting** - Files sorted in logical order (1, 2, 10 instead of 1, 10, 2)
- **Multiple Format Support** - MP3, WAV, AAC, OGG, FLAC

### 🎵 Full-Featured Player
- **Basic Controls** - Play/Pause, Next/Previous
- **Precise Time Seeking** - Skip buttons ±1s, ±3s, ±5s, ±10s
- **Interactive Progress Bar** - Click to jump to any position
- **Speed Control** - From 0.5x to 2x (perfect for listening practice)
- **Flexible Volume** - Slider and keyboard shortcuts

### 🔄 Advanced Playback Modes
- **Smart Repeat** - No repeat, repeat one, repeat N times, infinite repeat
- **Shuffle Mode** - Randomize playlist order
- **Continuous Play** - Auto-advance to next track in folder

### ⌨️ Powerful Keyboard Shortcuts
- **← / →** - Seek backward/forward 2 seconds
- **Shift + ← / →** - Previous/next track
- **Space** - Play/Pause
- **R** - Repeat mode
- **S** - Shuffle mode
- **+ / -** - Volume up/down
- **1, 3, 5, 0** - Quick time seeking
- **H** - Show help guide

## 🚀 How to Use

### 1. Open the Player
Open `index.html` in a modern web browser (Chrome, Edge, Firefox).

### 2. Select Music Folder
1. Click **"Chọn thư mục"** (Select Folder) button in sidebar
2. Choose a folder containing audio files from your computer
3. The app will scan and display all audio files

### 3. Play Music
- Click any file to start playing
- Use control buttons or keyboard shortcuts
- Adjust playback speed for your listening practice needs

### 4. Customize Experience
- Use repeat modes for listening practice
- Adjust volume for your environment
- Use keyboard shortcuts for quick control

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Web page structure
- **Tailwind CSS** - Modern CSS framework
- **Vanilla JavaScript** - Application logic
- **Font Awesome** - Icons

### Core APIs
- **File System Access API** - Computer folder access
- **Web Audio API** - Audio control
- **Intl.Collator** - Natural sorting

### Browser Compatibility
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Firefox 111+
- ✅ Safari 15.2+

## 📱 Responsive Design

### Desktop (≥1024px)
- Full two-column layout
- Sidebar takes 1/3 of screen
- Player takes 2/3 of screen
- All features displayed

### Tablet (768px-1023px)
- Flexible layout
- Collapsible sidebar
- Touch-optimized

### Mobile (≤767px)
- Single column layout
- Overlay sidebar
- Finger-friendly controls

## 🎹 Detailed Keyboard Shortcuts

| Key | Function | Description |
|-----|----------|-------------|
| `←` / `→` | Seek ±2s | Quick seek in track |
| `Shift + ←` / `→` | Prev/Next | Switch tracks in playlist |
| `Space` | Play/Pause | Control playback |
| `R` | Repeat Mode | Cycle through repeat modes |
| `S` | Shuffle | Toggle shuffle mode |
| `+` / `-` | Volume | Increase/decrease volume |
| `1` | Seek 1s | Seek ±1 second |
| `3` | Seek 3s | Seek ±3 seconds |
| `5` | Seek 5s | Seek ±5 seconds |
| `0` | Seek 10s | Seek ±10 seconds |
| `H` | Help | Show keyboard shortcuts |

## 🔧 Customization

### Playback Speed
- **0.5x** - Slow, perfect for beginners
- **0.75x** - Slightly slow, detailed listening
- **1x** - Normal speed
- **1.25x** - Slightly fast, time-saving
- **1.5x** - Fast, reflex training
- **2x** - Very fast, review mode

### Repeat Modes
- **No Repeat** - Stop after playlist ends
- **Repeat One** - Loop current track
- **Repeat N Times** - Custom repeat count
- **Infinite Repeat** - Loop playlist continuously

## 🎯 Listening Practice Applications

### Language Learning
- Repeat sentences/paragraphs for clarity
- Gradually increase speed as you improve
- Use precise seeking for pronunciation practice

### TOEIC/IELTS Training
- Repeat listening exercises
- Adjust speed to match your level
- Use seeking for detailed analysis

### Music Learning
- Loop musical passages to memorize
- Slow down to hear individual notes
- Shuffle for fresh perspective

## 📁 Project Structure

```
ListenHUB/
├── index.html          # Main page
├── script.js           # Application logic
├── styles.css          # Custom CSS
├── listenHUB.png       # Application logo
├── detail.md           # Detailed documentation
└── README.md           # This guide
```

## 🐛 Troubleshooting

### Common Issues
- **Browser not supported**: Update to latest version
- **Cannot access folder**: Grant file system access permission
- **File won't play**: Check supported file formats
- **Keyboard shortcuts not working**: Ensure page has focus

### Solutions
1. Use latest Chrome/Edge browser
2. Allow file system access when prompted
3. Check file formats (MP3, WAV, AAC, OGG, FLAC)
4. Click on the webpage before using keyboard shortcuts

## 🤝 Contributing

If you want to contribute to this project:

1. Fork the repository
2. Create a new feature branch
3. Commit and push your changes
4. Create a Pull Request



## 👨‍💻 Author

**Developed by chinhde**

- 🌐 GitHub: [github.com/Chinh-de](https://github.com/Chinh-de)
- 📧 Email: chinhde29@gmail.com
- 📱 Facebook: [facebook.com/ncd.de](https://www.facebook.com/ncd.de)

---

⭐ If you find this project useful, please give it a star!

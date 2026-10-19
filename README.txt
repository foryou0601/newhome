GIA ĐÌNH MỚI NHÚ — MÓN QUÀ 20/10

CHẠY TRÊN MÁY TÍNH / VSCODE
Giải nén ZIP, mở thư mục bằng VSCode. Có thể mở index.html trực tiếp trong Chrome/Edge, hoặc dùng extension Live Server > Open with Live Server.
Không cần npm, không cần build, không cần tài khoản dịch vụ hay thư viện bên ngoài.
Chép toàn bộ thư mục lên hosting tĩnh để xem trên điện thoại qua một đường dẫn. Nhạc chỉ bắt đầu sau thao tác bấm nút heo theo quy định trình duyệt.

TRÌNH TỰ
1. Nền đỏ rượu; bấm nút hình heo để bắt đầu nhạc.
2. Hai chú khỉ nhảy vào, mỗi chú nhào lộn đủ 3 vòng rồi nhảy lui vào phía trong sân khấu.
3. Rồng bay vào, phun lửa; lửa phủ toàn màn hình và tan ra để lộ lá thư.
4. Thư giữ nguyên nội dung người gửi đã cung cấp. Bấm “Cả nhà mở album nha” khi đọc xong.
5. Rồng con phun lửa, lần lượt mang đến toàn bộ 34 ảnh trong file nhamoinhu.zip. Mỗi ảnh xuất hiện một lần theo thứ tự tên tệp, không tự lặp vô hạn.
6. Sau ảnh cuối, hiện lời kết và toàn bộ album dạng lưới ở bên dưới.

ĐIỀU KHIỂN
- Nút nhạc ở góc trên: bật/tắt âm thanh; nếu trình duyệt chặn nhạc, chạm lại nút nhạc.
- Tạm dừng / Tiếp tục ở album.
- Chạm ảnh để xem toàn bộ ảnh lớn; đóng ảnh sẽ tiếp tục trình diễn.
- Khi chuyển tab hoặc mở ảnh lớn, chuyển động và thời gian giữ ảnh được tạm dừng.
- Xem lại album: chạy lại cả 34 ảnh.
- Quẩy lại từ đầu: quay lại màn chào và phát lại toàn bộ câu chuyện từ nút heo.
- Chế độ giảm chuyển động của thiết bị sẽ rút gọn các hiệu ứng mạnh, vẫn giữ đúng ba vòng và đủ ảnh.

CẤU TRÚC
index.html: bố cục và nội dung giao diện
css/style.css: màu đỏ rượu, bố cục máy tính/điện thoại, hiệu ứng trang trí
js/config.js: nguyên văn bức thư, đường dẫn bài hát, danh sách 34 ảnh
js/app.js: điều khiển các cảnh, nhào lộn, rồng bay, lửa, album và tạm dừng
images/monkey.webp và dragon.webp: nhân vật 3D dễ thương tạo bằng công cụ tạo ảnh
images/ky-niem-01.jpg ... ky-niem-34.jpg: toàn bộ ảnh bạn gửi, đã chỉnh hướng theo EXIF và giảm kích thước để tải nhẹ; khung ảnh lớn không cắt nội dung
music/telescope.mp3: bản nhạc Tim Legend - Telescope feat. Transviolet đúng tệp bạn đã gửi, không thay bài hay cắt nhạc
fonts/: phông cục bộ hỗ trợ tiếng Việt; không phụ thuộc Google Fonts

THAY NỘI DUNG
Mở js/config.js để thay thư, ảnh hoặc nhạc. Giữ đúng cấu trúc dấu nháy, dấu phẩy và mảng JavaScript.
Mỗi phần tử photos tương ứng một lần rồng con phun ảnh. Nếu thêm hoặc bớt ảnh, bộ đếm và lưới album sẽ cập nhật theo danh sách đó.
Mã nguồn dùng đường dẫn tương đối nên giữ nguyên cấu trúc các thư mục khi gửi hoặc đưa lên hosting.
Link Sites mặc định chỉ chủ sở hữu có quyền xem; cần thiết lập chia sẻ phù hợp trước khi gửi link Sites cho các chị.

GHI CHÚ HÌNH ẢNH
Nhân vật được tạo bằng công cụ tạo ảnh tích hợp, sau đó chuyển WebP có alpha để tối ưu web.
Monkey prompt: single adorable baby monkey, caramel brown fur, cream muzzle and belly, sparkling eyes, happy smile, burgundy bow tie, dancing full-body pose with raised arms and curled tail, premium soft 3D render, transparent background.
Dragon prompt: cute chubby baby dragon, apricot terracotta and honey-gold scales, cream belly, small burgundy wings and rounded horns, flying with tail left and open friendly mouth facing right, premium soft 3D render, transparent background.

Bạn là một Senior Frontend Engineer & UI/UX Designer tài năng. Hãy thiết kế và xây dựng toàn bộ giao diện Trang Chủ (HomePage / Index) cho website du lịch & ẩm thực Việt Nam mang tên "LangThang".
---
### 1. QUY CHUẨN MÀU SẮC HEADER & FOOTER (CỐ ĐỊNH)
#### HEADER (Thanh điều hướng trên cùng):
- **Nền (Background):** Trắng kính mờ (Glassmorphism) `rgba(255, 255, 255, 0.85)` kèm viền dưới xám nhạt `#E2E8F0`.
- **Màu chữ menu:** Xám đen than `#0F172A`.
- **Tab đang chọn (Active link):** Chữ xanh rừng `#064E3B` trên nền xanh ngọc nhạt `#ECFDF5`.
- **Nút "Đăng ký":** Nền xanh rừng `#064E3B`, chữ trắng `#FFFFFF`.
- **Logo:** `LangThang.` (Chữ xám đen `#0F172A`, dấu chấm màu cam đất `#EA580C`).
#### FOOTER (Chân trang dưới cùng):
- **Nền chính (Background):** Xanh rừng đêm sâu `#06281E`.
- **Viền trên (Top border):** Viền nhấn cam đất `#EA580C` (độ dày 2px).
- **Màu chữ:** Tiêu đề trắng `#FFFFFF`, nội dung xám bạc `#CBD5E1`.
- **Form nhận tin:** Ô nhập email nền `#042017` viền `#064E3B`, nút "Gửi" màu cam đất `#EA580C`.
*(Lưu ý: Bố cục, màu sắc thẻ, font chữ và phong cách trình bày các khối nội dung ở giữa bạn được tự do sáng tạo để giao diện đẹp, sang trọng và thu hút nhất).*
---
### 2. TOÀN BỘ NỘI DUNG VÀ DỮ LIỆU CẦN CÓ TRÊN TRANG CHỦ
#### KHỐI 1: HERO BANNER (BANNER CHÍNH)
- **Slogan chính:** "Mỗi chuyến đi là một điều kỳ diệu"
- **Mô tả:** "Khám phá những vùng đất hoang sơ, lưu lại quán ăn đặc sản bản địa và kiến tạo hành trình du lịch độc bản của riêng bạn."
- **Tìm kiếm:** Có ô tìm kiếm từ khóa và các nút gợi ý nhanh: *Miền Bắc, Miền Trung, Miền Nam, TP. Hồ Chí Minh, Hà Nội, Đà Nẵng*.
- **Chỉ số thống kê:** *63+ Tỉnh thành* | *1,200+ Địa điểm & món ngon* | *100% Trải nghiệm thực tế*.
#### KHỐI 2: KHÁM PHÁ 3 MIỀN VIỆT NAM
- **Tiêu đề:** "Khám phá 3 miền Việt Nam"
- **Mô tả:** "Từ những đỉnh núi mờ sương Tây Bắc đến vẻ trù phú của miệt vườn phương Nam, mỗi vùng miền là một trang ký ức rực rỡ."
- **Danh sách địa danh 3 miền:**
  - **Miền Bắc:**
    - *Hà Nội* (Tag: HOT) — "Thủ đô nghìn năm văn hiến, 36 phố phường rêu phong và ẩm thực tinh hoa nức tiếng."
    - *Sa Pa* (Tag: LÀO CAI) — "Thị trấn trong mây, ruộng bậc thang kỳ vĩ và nóc nhà Đông Dương Fansipan."
    - *Vịnh Hạ Long* (Tag: UNESCO) — "Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi nhô lên từ làn nước ngọc bích."
    - *Ninh Bình* (Tag: TRÀNG AN) — "Vịnh Hạ Long trên cạn, hang Múa tuyệt đẹp và non nước Tràng An hữu tình."
    - *Hà Giang* (Tag: ĐỒNG VĂN) — "Đèo Mã Pí Lèng hiểm trở, dòng sông Nho Quế xanh ngắt và mùa hoa tam giác mạch."
  - **Miền Trung:**
    - *Hội An* (Tag: HOT) — "Phố cổ lung linh hoa đăng, những mảng tường vàng hoài niệm và cà phê bên sông Hoài."
    - *Đà Nẵng* (Tag: BIỂN MỸ KHÊ) — "Thành phố đáng sống, bãi biển quyến rũ hàng đầu hành tinh và Cầu Vàng nổi tiếng."
    - *Đà Lạt* (Tag: HOT) — "Thành phố ngàn hoa, không khí mát lành, rừng thông bạt ngàn và những quán cafe thơ mộng."
    - *Huế* (Tag: CỐ ĐÔ) — "Kinh thành cổ kính, sông Hương êm đềm và ẩm thực cung đình truyền thống đặc sắc."
    - *Phong Nha* (Tag: KỲ QUAN) — "Hệ thống hang động thạch nhũ huyền ảo triệu năm tuổi và thiên nhiên hoang sơ tráng lệ."
  - **Miền Nam:**
    - *TP. Hồ Chí Minh* (Tag: HOT) — "Thành phố không ngủ, nhịp sống hiện đại giao thoa cùng văn hóa ẩm thực đường phố độc đáo."
    - *Vũng Tàu* (Tag: BÀ RỊA) — "Gió biển mát rượi, ngọn hải đăng cổ kính và thiên đường hải sản tươi sống chỉ cách Sài Gòn 2 giờ."
    - *Phú Quốc* (Tag: ĐẢO NGỌC) — "Hoàng hôn buông đỏ rực rỡ, bãi sao cát trắng mịn và những khu nghỉ dưỡng sang trọng bậc nhất."
    - *Cần Thơ* (Tag: CHỢ NỔI) — "Tây Đô hiền hòa, chợ nổi Cái Răng tấp nập sớm mai và miệt vườn trĩu quả thơm lừng."
    - *An Giang* (Tag: TRÀ SƯ) — "Thảm bèo xanh mướt trải dài mùa nước nổi và văn hóa giao thoa đa sắc tộc Chăm, Khmer, Kinh."
#### KHỐI 3: BỘ SƯU TẬP NỔI BẬT: "Chuyến đi vòng quanh thành phố mang tên Bác"
1. *Tour Xe Máy Trải Nghiệm Ẩm Thực Đường Phố Sài Gòn (Chuẩn Michelin)* — Giá: từ 750.000đ / khách (Đánh giá: 5.0★ - 9,642 lượt)
2. *Khám Phá Sài Gòn Về Đêm Bằng Xe Máy & Thưởng Thức Món Ngon Hẻm* — Giá: từ 680.000đ / khách (Đánh giá: 5.0★ - 745 lượt)
3. *Tour VIP Khám Phá Địa Đạo Củ Chi & Trải Nghiệm Miệt Vườn Sông Nước* — Giá: từ 850.000đ / khách (Đánh giá: 5.0★ - 1,185 lượt)
4. *Du Thuyền Hoàng Hôn Sông Sài Gòn & Ẩm Thực Tinh Hoa Ven Sông* — Giá: từ 1.250.000đ / khách (Đánh giá: 5.0★ - 2,336 lượt)
*(Có chức năng nút Tim để lưu/bỏ lưu yêu thích trên từng thẻ).*
#### KHỐI 4: HƯƠNG VỊ ẨM THỰC ĐỊA PHƯƠNG (CÓ BỘ LỌC VÙNG MIỀN)
- **Tiêu đề:** "Hương vị ẩm thực địa phương"
- **Mô tả:** "Mỗi món ăn là một câu chuyện văn hóa được chắt lọc qua nhiều thế hệ."
- **Bộ lọc chuyển Tab tương tác:** `[Tất cả]` | `[Miền Bắc]` | `[Miền Trung]` | `[Miền Nam]`.
- **Dữ liệu món ăn theo miền:**
  - *Miền Bắc:* Phở Bò Gia Truyền (Xuất xứ: Hà Nội)
  - *Miền Trung:* Bánh Mì Phố Cổ (Xuất xứ: Hội An), Bún Bò Cố Đô (Xuất xứ: Thừa Thiên Huế)
  - *Miền Nam:* Cơm Tấm Sườn Bì (Xuất xứ: TP. Hồ Chí Minh)
- Mỗi món ăn có tên món, badge nguồn gốc xuất xứ và link dẫn *"Khám phá địa chỉ →"*.
#### KHỐI 5: HÀNH TRÌNH GỢI Ý
- **Tiêu đề:** "Hành trình gợi ý" (Badge: *LỊCH TRÌNH TỐI ƯU*)
- **Mô tả:** "Các lịch trình được thiết kế bài bản từ các thành viên giàu kinh nghiệm."
- **Dữ liệu các chuyến đi:**
  1. *Đà Lạt - Thành phố mộng mơ* | Thời lượng: `3N2Đ` | Thể loại: `Nghỉ dưỡng` | Đánh giá: ★ 4.9 (128) | Tác giả: `Nguyễn Minh Anh` | Tóm tắt: "Trải nghiệm săn mây Cầu Đất, nhâm nhi cà phê đồi thông và khám phá các góc check-in cực thơ."
  2. *Sa Pa - Chinh phục Fansipan* | Thời lượng: `4N3Đ` | Thể loại: `Trải nghiệm` | Đánh giá: ★ 4.8 (95) | Tác giả: `Hoàng Nam` | Tóm tắt: "Chinh phục đỉnh Fansipan hùng vĩ, khám phá văn hóa bản Cát Cát và thưởng thức lẩu cá tầm nóng hổi."
#### KHỐI 6: BLOG & CẨM NANG DU LỊCH
- **Tiêu đề:** "Blog & Cẩm nang du lịch" (Badge: *CHIA SẺ KINH NGHIỆM*) + Link *"Tất cả bài viết →"*.
- **Danh sách bài viết:**
  1. *10 món ăn đường phố nhất định phải thử khi đến Sài Gòn* (Chủ đề: `ẨM THỰC` | Tác giả: `Nguyễn Minh Anh` | Thời gian đọc: `5 phút đọc` | Tóm tắt: "Cơm tấm đêm, hủ tiếu gõ và các quán ốc hẻm sâu mang đậm nét bình dị khó quên của đất Sài Thành.")
  2. *Hành trình trekking khám phá hệ thống hang động Phong Nha* (Chủ đề: `KINH NGHIỆM` | Tác giả: `Tuấn Phong` | Thời gian đọc: `7 phút đọc` | Tóm tắt: "Cẩm nang chuẩn bị thể lực và trang thiết bị an toàn cho chuyến đi vượt rừng khám phá hang động kỳ vĩ.")
  3. *Nghệ thuật thưởng thức cà phê trứng giữa lòng phố cổ Hà Nội* (Chủ đề: `VĂN HÓA` | Tác giả: `Minh Tú` | Thời gian đọc: `4 phút đọc` | Tóm tắt: "Một tách cà phê thơm béo kể lại lịch sử và gu ẩm thực tinh tế của người Tràng An qua bao thế hệ.")
---
### 3. YÊU CẦU ĐẦU RA
- Viết code bằng **React (TypeScript) + TailwindCSS** (dùng icon từ thư viện `lucide-react`).
- Tự do thiết kế bố cục các khối ở giữa sao cho hiện đại, cân đối, mượt mà và tối ưu trải nghiệm người dùng.
- Có xử lý fallback hình ảnh để đảm bảo không bị lỗi ảnh vỡ.
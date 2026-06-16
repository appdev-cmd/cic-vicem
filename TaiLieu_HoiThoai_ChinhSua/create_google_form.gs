/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG TẠO GOOGLE FORM KHẢO SÁT TRỰC TUYẾN
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Truy cập vào đường dẫn: https://script.google.com
 * 2. Đăng nhập bằng tài khoản Google của bạn (Gmail hoặc Google Workspace doanh nghiệp).
 * 3. Nhấp vào nút "Dự án mới" (New Project).
 * 4. Xóa toàn bộ mã code mặc định (nếu có) và dán toàn bộ đoạn mã dưới đây vào.
 * 5. Nhấn nút "Lưu" (Save - biểu tượng đĩa mềm) và đặt tên dự án tùy ý (ví dụ: "Tao Form Khao Sat").
 * 6. Nhấn nút "Chạy" (Run - biểu tượng hình tam giác hướng sang phải).
 * 7. Cấp quyền truy cập cho script (nếu có thông báo hiển thị: Nhấn "Xem quyền" -> Chọn tài khoản -> Nhấn "Nâng cao" -> Nhấn "Đi tới dự án không an toàn" -> Nhấn "Cho phép").
 * 8. Xem kết quả ở tab "Nhật ký thực thi" (Execution Log) ở phía dưới cùng để lấy đường dẫn chỉnh sửa Form và xem trước Form.
 */

function createSurveyForm() {
  var form = FormApp.create('Bộ câu hỏi khảo sát trực tuyến - VICEM Hà Tiên');
  form.setDescription('Khảo sát hiện trạng áp dụng quy trình quản lý dự án và nhu cầu tư vấn mô hình tổ chức Ban Quản lý dự án phục vụ cập nhật quy chế tương thích Luật Xây dựng 135/2025.');
  
  // -------------------------------------------------------------------------
  // PHẦN A: THÔNG TIN NGƯỜI TRẢ LỜI
  // -------------------------------------------------------------------------
  var sectionA = form.addPageBreakItem()
      .setTitle('PHẦN A: THÔNG TIN NGƯỜI TRẢ LỜI')
      .setHelpText('Mục đích khảo sát: Phân loại đối tượng trả lời để đánh giá ý kiến khảo sát theo từng góc độ chuyên môn (Chủ đầu tư, Phòng ban tham mưu Công ty, Lãnh đạo) và thâm niên kinh nghiệm thực tế tại đơn vị.');
      
  form.addTextItem().setTitle('A1. Họ tên').setRequired(true);
  form.addTextItem().setTitle('A2. Chức vụ').setRequired(true);
  
  var qA3 = form.addMultipleChoiceItem().setTitle('A3. Phòng Ban').setRequired(true);
  qA3.setChoices([
    qA3.createChoice('Phòng Kế hoạch Chiến lược'),
    qA3.createChoice('Phòng Tài chính Kế toán'),
    qA3.createChoice('Phòng Kỹ thuật'),
    qA3.createChoice('Phòng Vật tư'),
    qA3.createChoice('Phòng Tổ chức Hành chính'),
    qA3.createChoice('Phòng An toàn Môi trường'),
    qA3.createChoice('Phòng Kiểm tra Pháp chế'),
    qA3.createChoice('Phòng Công nghệ Thông tin'),
    qA3.createChoice('Ban Quản lý Dự án'),
    qA3.createChoice('Các Tổ Chuyên gia'),
    qA3.createChoice('Các Tổ Thẩm định')
  ]);
  
  var qA4 = form.addMultipleChoiceItem().setTitle('A4. Thâm niên công tác tại VICEM Hà Tiên').setRequired(true);
  qA4.setChoices([
    qA4.createChoice('Dưới 2 năm'),
    qA4.createChoice('2–5 năm'),
    qA4.createChoice('5–10 năm'),
    qA4.createChoice('Trên 10 năm')
  ]);
  
  var qA5 = form.addCheckboxItem().setTitle('A5. Anh/chị tham gia vào giai đoạn nào của quy trình Quản lý dự án? (chọn nhiều)').setRequired(true);
  qA5.setChoices([
    qA5.createChoice('Chuẩn bị dự án (lập Báo cáo đề xuất chủ trương đầu tư, Báo cáo nghiên cứu khả thi, phê duyệt chủ trương đầu tư/Quyết định đầu tư)'),
    qA5.createChoice('Lựa chọn nhà thầu, ký kết hợp đồng'),
    qA5.createChoice('Quản lý thực hiện hợp đồng (giám sát tiến độ, chất lượng)'),
    qA5.createChoice('Quản lý chất lượng (khảo sát, thiết kế, thi công, nghiệm thu)'),
    qA5.createChoice('Thanh toán, quyết toán hợp đồng'),
    qA5.createChoice('Quyết toán dự án hoàn thành'),
    qA5.createChoice('Số hóa, lưu trữ hồ sơ'),
    qA5.createChoice('Khác')
  ]);

  // -------------------------------------------------------------------------
  // PHẦN B: ĐÁNH GIÁ 8 QUY TRÌNH HIỆN CÓ
  // -------------------------------------------------------------------------
  var sectionB = form.addPageBreakItem()
      .setTitle('PHẦN B: ĐÁNH GIÁ 8 QUY TRÌNH HIỆN CÓ')
      .setHelpText('Mục đích khảo sát: Thu thập phản hồi thực tế của cán bộ trực tiếp vận hành về tính phù hợp, các vướng mắc phổ biến và sự sai lệch giữa quy trình trên giấy so với thực tế của 8 quy trình hiện hành. Đây là cơ sở thực tế để CIC loại bỏ các bước thừa, chuẩn hóa các bước vướng mắc khi tiến hành cập nhật lại 8 quy trình này.');
      
  // Quy trình 34
  form.addSectionHeaderItem().setTitle('Quy trình 34 — Quản lý dự án tổng thể');
  var qB1 = form.addMultipleChoiceItem().setTitle('B1. Mức độ phù hợp của Quy trình 34 với thực tế công việc hiện tại?');
  qB1.setChoices([
    qB1.createChoice('1 — Rất không phù hợp'),
    qB1.createChoice('2 — Không phù hợp'),
    qB1.createChoice('3 — Tạm được'),
    qB1.createChoice('4 — Phù hợp'),
    qB1.createChoice('5 — Rất phù hợp'),
    qB1.createChoice('Không áp dụng')
  ]);
  form.addParagraphTextItem().setTitle('B2. Điểm vướng mắc/bất cập chính khi áp dụng Quy trình 34? (mô tả ngắn gọn)');
  form.addParagraphTextItem().setTitle('B3. Có bước nào trong Quy trình 34 mà thực tế đang làm khác so với quy trình trên giấy? Nếu có, mô tả.');

  // Quy trình 35
  form.addSectionHeaderItem().setTitle('Quy trình 35 — Lựa chọn nhà thầu và ký kết hợp đồng');
  var qB4 = form.addMultipleChoiceItem().setTitle('B4. Mức độ phù hợp của Quy trình 35 với thực tế công việc hiện tại?');
  qB4.setChoices([qB4.createChoice('1'), qB4.createChoice('2'), qB4.createChoice('3'), qB4.createChoice('4'), qB4.createChoice('5'), qB4.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B5. Điểm vướng mắc chính khi áp dụng Quy trình 35?');
  form.addParagraphTextItem().setTitle('B6. Thực tế áp dụng Quy trình 35 có khác so với trên giấy không? Mô tả.');

  // Quy trình 36
  form.addSectionHeaderItem().setTitle('Quy trình 36 — Quản lý chất lượng giai đoạn chuẩn bị đầu tư');
  var qB7 = form.addMultipleChoiceItem().setTitle('B7. Mức độ phù hợp của Quy trình 36 với thực tế công việc hiện tại?');
  qB7.setChoices([qB7.createChoice('1'), qB7.createChoice('2'), qB7.createChoice('3'), qB7.createChoice('4'), qB7.createChoice('5'), qB7.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B8. Điểm vướng mắc chính khi áp dụng Quy trình 36?');
  form.addParagraphTextItem().setTitle('B9. Thực tế áp dụng Quy trình 36 có khác so với trên giấy không? Mô tả.');

  // Quy trình 37
  form.addSectionHeaderItem().setTitle('Quy trình 37 — Quản lý thực hiện hợp đồng');
  var qB10 = form.addMultipleChoiceItem().setTitle('B10. Mức độ phù hợp của Quy trình 37 với thực tế công việc hiện tại?');
  qB10.setChoices([qB10.createChoice('1'), qB10.createChoice('2'), qB10.createChoice('3'), qB10.createChoice('4'), qB10.createChoice('5'), qB10.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B11. Điểm vướng mắc chính khi áp dụng Quy trình 37?');
  form.addParagraphTextItem().setTitle('B12. Thực tế áp dụng Quy trình 37 có khác so với trên giấy không? Mô tả.');

  // Quy trình 16
  form.addSectionHeaderItem().setTitle('Quy trình 16 — Quản lý chất lượng trong hoạt động đầu tư xây dựng');
  var qB13 = form.addMultipleChoiceItem().setTitle('B13. Mức độ phù hợp của Quy trình 16 với thực tế công việc hiện tại?');
  qB13.setChoices([qB13.createChoice('1'), qB13.createChoice('2'), qB13.createChoice('3'), qB13.createChoice('4'), qB13.createChoice('5'), qB13.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B14. Điểm vướng mắc chính khi áp dụng Quy trình 16?');
  form.addParagraphTextItem().setTitle('B15. Thực tế áp dụng Quy trình 16 có khác so với trên giấy không? Mô tả.');

  // Quy trình 17
  form.addSectionHeaderItem().setTitle('Quy trình 17 — Thanh, quyết toán hợp đồng đầu tư xây dựng');
  var qB16 = form.addMultipleChoiceItem().setTitle('B16. Mức độ phù hợp của Quy trình 17 với thực tế công việc hiện tại?');
  qB16.setChoices([qB16.createChoice('1'), qB16.createChoice('2'), qB16.createChoice('3'), qB16.createChoice('4'), qB16.createChoice('5'), qB16.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B17. Điểm vướng mắc chính khi áp dụng Quy trình 17?');
  form.addParagraphTextItem().setTitle('B18. Thực tế áp dụng Quy trình 17 có khác so với trên giấy không? Mô tả.');

  // Quy trình 18
  form.addSectionHeaderItem().setTitle('Quy trình 18 — Quyết toán dự án hoàn thành');
  var qB19 = form.addMultipleChoiceItem().setTitle('B19. Mức độ phù hợp của Quy trình 18 với thực tế công việc hiện tại?');
  qB19.setChoices([qB19.createChoice('1'), qB19.createChoice('2'), qB19.createChoice('3'), qB19.createChoice('4'), qB19.createChoice('5'), qB19.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B20. Điểm vướng mắc chính khi áp dụng Quy trình 18?');
  form.addParagraphTextItem().setTitle('B21. Thực tế áp dụng Quy trình 18 có khác so với trên giấy không? Mô tả.');

  // Quy trình 161
  form.addSectionHeaderItem().setTitle('Quy trình 161 — Số hóa và lưu trữ tài liệu');
  var qB22 = form.addMultipleChoiceItem().setTitle('B22. Mức độ phù hợp của Quy trình 161 với thực tế công việc hiện tại?');
  qB22.setChoices([qB22.createChoice('1'), qB22.createChoice('2'), qB22.createChoice('3'), qB22.createChoice('4'), qB22.createChoice('5'), qB22.createChoice('Không áp dụng')]);
  form.addParagraphTextItem().setTitle('B23. Điểm vướng mắc chính khi áp dụng Quy trình 161?');
  form.addParagraphTextItem().setTitle('B24. Thực tế áp dụng Quy trình 161 có khác so với trên giấy không? Mô tả.');

  // -------------------------------------------------------------------------
  // PHẦN C: NHẬN DIỆN NHU CẦU QUY TRÌNH MỚI
  // -------------------------------------------------------------------------
  var sectionC = form.addPageBreakItem()
      .setTitle('PHẦN C: NHẬN DIỆN NHU CẦU QUY TRÌNH MỚI')
      .setHelpText('Mục đích khảo sát: Đánh giá nhu cầu thực tế, hạ tầng công nghệ và sự sẵn sàng của nhân sự đối với 4 quy trình cần ban hành mới để thiết lập cấu trúc quy trình sát thực tế.');

  // C1
  form.addSectionHeaderItem().setTitle('C1. Quản lý Mô hình thông tin công trình và Môi trường dữ liệu chung')
      .setHelpText('Mục đích khảo sát: Xác định mức độ tiếp cận công nghệ thực tế và năng lực tự thẩm tra mô hình của nhân sự để xây dựng quy trình bàn giao, quản lý mô hình thông tin công trình (BIM) phù hợp với năng lực hiện có của đơn vị.');
  
  var qC1_1 = form.addMultipleChoiceItem().setTitle('C1.1. Đơn vị đã áp dụng Mô hình thông tin công trình trong dự án nào chưa?');
  qC1_1.setChoices([
    qC1_1.createChoice('Chưa áp dụng'),
    qC1_1.createChoice('Đã yêu cầu nhà thầu sử dụng nhưng Chủ đầu tư chưa quản lý'),
    qC1_1.createChoice('Đã áp dụng ở mức cơ bản (xem mô hình phối cảnh 3D)'),
    qC1_1.createChoice('Đã áp dụng và quản lý trên Môi trường dữ liệu chung')
  ]);
  form.addTextItem().setTitle('C1.2. Phần mềm hỗ trợ dựng và quản lý mô hình đang sử dụng (nếu có):');
  
  var qC1_3 = form.addMultipleChoiceItem().setTitle('C1.3. Đánh giá mức độ sẵn sàng áp dụng quy trình Mô hình thông tin công trình/Môi trường dữ liệu chung tại đơn vị:');
  qC1_3.setChoices([
    qC1_3.createChoice('1 — Chưa sẵn sàng, cần đầu tư hạ tầng công nghệ thông tin + đào tạo nhân lực'),
    qC1_3.createChoice('2 — Có nền tảng cơ bản, cần hỗ trợ nhiều'),
    qC1_3.createChoice('3 — Tương đối sẵn sàng'),
    qC1_3.createChoice('4 — Sẵn sàng triển khai ngay')
  ]);

  var qC1_4 = form.addMultipleChoiceItem().setTitle('C1.4. Đơn vị có định hướng sử dụng định dạng dữ liệu nào khi trao đổi mô hình thiết kế với nhà thầu không?');
  qC1_4.setChoices([qC1_4.createChoice('Định dạng tệp gốc của phần mềm thiết kế (Revit, AutoCAD, etc.)'), qC1_4.createChoice('Định dạng trao đổi dữ liệu mở (IFC, PDF 3D, etc.)'), qC1_4.createChoice('Chưa có định hướng cụ thể')]);

  var qC1_5 = form.addMultipleChoiceItem().setTitle('C1.5. Đã từng đưa yêu cầu sử dụng Mô hình thông tin công trình vào hồ sơ mời thầu khi lựa chọn nhà thầu chưa?');
  qC1_5.setChoices([qC1_5.createChoice('Có, đã yêu cầu trong hồ sơ mời thầu'), qC1_5.createChoice('Chưa, nhưng có kế hoạch'), qC1_5.createChoice('Chưa và chưa có kế hoạch')]);

  var qC1_6 = form.addMultipleChoiceItem().setTitle('C1.6. Đơn vị có năng lực thẩm tra mô hình (kiểm tra phát hiện xung đột thiết kế, kiểm tra tuân thủ thiết kế) không?');
  qC1_6.setChoices([qC1_6.createChoice('Có năng lực nội bộ'), qC1_6.createChoice('Cần thuê tư vấn chuyên môn độc lập'), qC1_6.createChoice('Chưa có năng lực')]);

  // C2
  form.addSectionHeaderItem().setTitle('C2. Bàn giao, bảo hành và bảo trì công trình')
      .setHelpText('Mục đích khảo sát: Đánh giá hiện trạng bàn giao tài sản và tỷ lệ giữ lại tiền bảo hành thực tế để làm căn cứ thiết lập các bước nghiệm thu, theo dõi bảo hành trong Quy trình bàn giao, bảo hành mới.');

  var qC2_1 = form.addMultipleChoiceItem().setTitle('C2.1. Hiện đang thực hiện bàn giao công trình hoàn thành theo quy trình nào?');
  qC2_1.setChoices([qC2_1.createChoice('Theo quy định trong Quy trình 16'), qC2_1.createChoice('Theo thỏa thuận hợp đồng từng dự án'), qC2_1.createChoice('Chưa có quy trình chuẩn, làm theo kinh nghiệm'), qC2_1.createChoice('Khác')]);

  var qC2_2 = form.addMultipleChoiceItem().setTitle('C2.2. Việc theo dõi bảo hành sau nghiệm thu đang thực hiện thế nào?');
  qC2_2.setChoices([qC2_2.createChoice('Có hệ thống theo dõi (tệp theo dõi/phần mềm)'), qC2_2.createChoice('Theo dõi bằng công văn/thư điện tử khi phát sinh lỗi'), qC2_2.createChoice('Chưa có cơ chế theo dõi chủ động')]);

  var qC2_3 = form.addCheckboxItem().setTitle('C2.3. Khi bàn giao công trình hoàn thành, hồ sơ bàn giao thường bao gồm các tài liệu nào sau đây? (chọn nhiều)');
  qC2_3.setChoices([
    qC2_3.createChoice('Bản vẽ hoàn công'),
    qC2_3.createChoice('Quy trình hướng dẫn vận hành công trình'),
    qC2_3.createChoice('Quy trình bảo trì công trình'),
    qC2_3.createChoice('Danh mục thiết bị/phụ tùng/vật tư dự trữ'),
    qC2_3.createChoice('Không rõ hồ sơ bàn giao gồm những gì')
  ]);

  var qC2_4 = form.addMultipleChoiceItem().setTitle('C2.4. Mức tiền giữ lại bảo hành hợp đồng hiện đang áp dụng?');
  qC2_4.setChoices([qC2_4.createChoice('Dưới hoặc bằng 3% giá trị hợp đồng'), qC2_4.createChoice('Từ 3% đến 5% giá trị hợp đồng'), qC2_4.createChoice('Trên 5% giá trị hợp đồng'), qC2_4.createChoice('Tùy theo từng hợp đồng, không cố định'), qC2_4.createChoice('Không rõ')]);

  var qC2_5 = form.addMultipleChoiceItem().setTitle('C2.5. Có kế hoạch bảo trì công trình sau bàn giao không?');
  qC2_5.setChoices([qC2_5.createChoice('Có kế hoạch bảo trì định kỳ'), qC2_5.createChoice('Chỉ sửa chữa khi hư hỏng'), qC2_5.createChoice('Chưa có kế hoạch cụ thể')]);

  // C3
  form.addSectionHeaderItem().setTitle('C3. Giám sát, đánh giá và báo cáo dự án định kỳ')
      .setHelpText('Mục đích khảo sát: Làm rõ tần suất báo cáo và vai trò của phòng Kế hoạch Chiến lược trong việc lập/đánh giá hiệu quả dự án sau đầu tư để đưa vào quy chế báo cáo trong Quy trình giám sát, đánh giá mới.');

  var qC3_1 = form.addMultipleChoiceItem().setTitle('C3.1. Hiện đang báo cáo tiến độ/chi phí dự án theo tần suất nào?');
  qC3_1.setChoices([qC3_1.createChoice('Hàng tuần'), qC3_1.createChoice('Hàng tháng'), qC3_1.createChoice('Hàng quý'), qC3_1.createChoice('Khi có yêu cầu đột xuất'), qC3_1.createChoice('Không có cơ chế báo cáo định kỳ')]);

  var qC3_2 = form.addMultipleChoiceItem().setTitle('C3.2. Biểu mẫu báo cáo tiến độ: có được chuẩn hóa không?');
  qC3_2.setChoices([qC3_2.createChoice('Có biểu mẫu chuẩn theo quy định'), qC3_2.createChoice('Mỗi dự án báo cáo theo định dạng khác nhau'), qC3_2.createChoice('Chỉ báo cáo bằng thư điện tử/văn bản tự do')]);

  var qC3_3 = form.addCheckboxItem().setTitle('C3.3. Báo cáo gửi cho ai? (chọn nhiều)');
  qC3_3.setChoices([qC3_3.createChoice('Giám đốc Ban Quản lý dự án'), qC3_3.createChoice('Tổng Giám đốc Công ty'), qC3_3.createChoice('Hội đồng quản trị Công ty'), qC3_3.createChoice('Tổng công ty VICEM'), qC3_3.createChoice('Khác')]);

  var qC3_4 = form.addMultipleChoiceItem().setTitle('C3.4. VICEM Hà Tiên hiện có thực hiện quy trình đánh giá hiệu quả dự án sau khi hoàn thành bàn giao đưa vào sử dụng (so sánh công suất thực tế đạt được, doanh thu, thời gian thu hồi vốn thực tế so với phương án ban đầu) không?');
  qC3_4.setChoices([qC3_4.createChoice('Có thực hiện định kỳ và có quy trình chuẩn'), qC3_4.createChoice('Chỉ thực hiện khi có yêu cầu đột xuất của Ban Giám đốc / Tổng công ty'), qC3_4.createChoice('Chưa thực hiện đánh giá sau đầu tư'), qC3_4.createChoice('Không rõ')]);

  // C4
  form.addSectionHeaderItem().setTitle('C4. Quản lý an toàn lao động và môi trường thi công')
      .setHelpText('Mục đích khảo sát: Khảo sát thực trạng phân định trách nhiệm an toàn trên công trường và nhân sự chuyên trách phục vụ việc biên soạn Quy trình an toàn lao động và môi trường thi công mới.');

  var qC4_1 = form.addMultipleChoiceItem().setTitle('C4.1. Hiện có quy trình an toàn lao động riêng cho dự án đầu tư xây dựng không?');
  qC4_1.setChoices([qC4_1.createChoice('Có quy trình riêng do Ban Quản lý dự án ban hành'), qC4_1.createChoice('Áp dụng quy trình an toàn lao động chung của Nhà máy'), qC4_1.createChoice('Yêu cầu nhà thầu tự đảm bảo, Ban Quản lý dự án chỉ giám sát'), qC4_1.createChoice('Chưa có quy định cụ thể')]);

  var qC4_2 = form.addMultipleChoiceItem().setTitle('C4.2. Trong 3 năm gần nhất, đã xảy ra sự cố an toàn lao động tại công trường đầu tư xây dựng nào chưa?');
  qC4_2.setChoices([qC4_2.createChoice('Chưa'), qC4_2.createChoice('Có, sự cố nhỏ'), qC4_2.createChoice('Có, sự cố nghiêm trọng')]);

  var qC4_3 = form.addMultipleChoiceItem().setTitle('C4.3. Ai chịu trách nhiệm chính về an toàn lao động tại công trường?');
  qC4_3.setChoices([qC4_3.createChoice('Nhà thầu thi công'), qC4_3.createChoice('Tư vấn giám sát'), qC4_3.createChoice('Ban Quản lý dự án (Chủ đầu tư)'), qC4_3.createChoice('Chưa phân định rõ')]);

  var qC4_4 = form.addMultipleChoiceItem().setTitle('C4.4. Nhà thầu thi công có phải trình kế hoạch an toàn lao động cho Chủ đầu tư phê duyệt/chấp thuận trước khi thi công không?');
  qC4_4.setChoices([qC4_4.createChoice('Có, bắt buộc'), qC4_4.createChoice('Tùy từng dự án'), qC4_4.createChoice('Không yêu cầu')]);

  var qC4_5 = form.addMultipleChoiceItem().setTitle('C4.5. Ban Quản lý dự án có bố trí nhân sự quản lý an toàn lao động chuyên trách (được đào tạo chuyên ngành an toàn lao động hoặc kinh tế xây dựng) không?');
  qC4_5.setChoices([qC4_5.createChoice('Có nhân sự chuyên trách'), qC4_5.createChoice('Nhân sự kiêm nhiệm'), qC4_5.createChoice('Chưa có')]);

  var qC4_6 = form.addCheckboxItem().setTitle('C4.6. Biện pháp bảo vệ môi trường tại công trường đầu tư xây dựng: (chọn nhiều)');
  qC4_6.setChoices([qC4_6.createChoice('Có kế hoạch quản lý chất thải xây dựng'), qC4_6.createChoice('Có biện pháp chống bụi, chống ồn'), qC4_6.createChoice('Có cam kết bảo vệ môi trường được phê duyệt'), qC4_6.createChoice('Chưa có biện pháp cụ thể')]);

  // -------------------------------------------------------------------------
  // PHẦN D: ĐÁNH GIÁ HẠ TẦNG CÔNG NGHỆ THÔNG TIN VÀ SỐ HÓA
  // -------------------------------------------------------------------------
  var sectionD = form.addPageBreakItem()
      .setTitle('PHẦN D: ĐÁNH GIÁ HẠ TẦNG CÔNG NGHỆ THÔNG TIN VÀ SỐ HÓA')
      .setHelpText('Mục đích khảo sát: Đánh giá hạ tầng phần mềm hiện có và rào cản kết nối dữ liệu trực tuyến để đề xuất phương án số hóa quy trình (nhật ký điện tử, ký số) tương thích với năng lực công nghệ thông tin của công ty.');

  var qD1 = form.addCheckboxItem().setTitle('D1. Phần mềm đang sử dụng trong quản lý dự án: (chọn nhiều)');
  qD1.setChoices([
    qD1.createChoice('Sử dụng các phần mềm văn phòng thông thường (Word, Excel) là chính'),
    qD1.createChoice('Phần mềm quản lý tiến độ (Microsoft Project hoặc Primavera)'),
    qD1.createChoice('Phần mềm dự toán chuyên dụng'),
    qD1.createChoice('Phần mềm kế toán'),
    qD1.createChoice('Hệ thống chia sẻ và lưu trữ tài liệu trực tuyến (SharePoint, Google Drive...)'),
    qD1.createChoice('Phần mềm Mô hình thông tin công trình (Revit, Navisworks...)'),
    qD1.createChoice('Chữ ký số'),
    qD1.createChoice('Khác')
  ]);

  var qD2 = form.addMultipleChoiceItem().setTitle('D2. Biểu mẫu hồ sơ hiện tại chủ yếu ở dạng:');
  qD2.setChoices([qD2.createChoice('Bản giấy, in ra ký tay'), qD2.createChoice('Bản điện tử, ký số trực tiếp trên file'), qD2.createChoice('Biểu mẫu trực tuyến (Google Form hoặc nền tảng tương đương)'), qD2.createChoice('Kết hợp nhiều dạng')]);

  var qD3 = form.addMultipleChoiceItem().setTitle('D3. Mức độ sẵn sàng chuyển sang biểu mẫu điện tử hoàn toàn?');
  qD3.setChoices([qD3.createChoice('1 — Chưa sẵn sàng'), qD3.createChoice('2 — Cần thời gian chuyển đổi (6–12 tháng)'), qD3.createChoice('3 — Có thể chuyển đổi trong 3–6 tháng'), qD3.createChoice('4 — Sẵn sàng áp dụng ngay')]);

  var qD4 = form.addCheckboxItem().setTitle('D4. Theo anh/chị, rào cản lớn nhất đối với việc chia sẻ và kết nối dữ liệu dự án trực tuyến giữa Ban Quản lý dự án, các phòng ban Công ty và các Nhà máy/Trạm nghiền thành viên hiện nay là gì? (chọn nhiều)');
  qD4.setChoices([
    qD4.createChoice('Hạ tầng mạng, đường truyền và hệ thống máy chủ chưa đồng bộ'),
    qD4.createChoice('Chưa có nền tảng phần mềm dùng chung (như SharePoint, hệ thống quản lý tài liệu tập trung)'),
    qD4.createChoice('Ý thức, thói quen làm việc trên môi trường số của nhân sự còn hạn chế'),
    qD4.createChoice('Quy định bảo mật thông tin nội bộ của công ty chưa cho phép kết nối mở rộng'),
    qD4.createChoice('Khác')
  ]);

  // -------------------------------------------------------------------------
  // PHẦN E: BẢO TRÌ CÔNG TRÌNH VÀ AN TOÀN
  // -------------------------------------------------------------------------
  var sectionE = form.addPageBreakItem()
      .setTitle('PHẦN E: BẢO TRÌ CÔNG TRÌNH VÀ AN TOÀN')
      .setHelpText('Mục đích khảo sát: Đánh giá thực trạng quản lý chất lượng, nghiệm thu, bàn giao, bảo hành và bảo trì tại đơn vị để thiết lập chi tiết các quy trình nghiệp vụ tương thích.');

  // E1
  form.addSectionHeaderItem().setTitle('E1. Quy trình bảo trì công trình')
      .setHelpText('Mục đích khảo sát: Đánh giá việc lập quy trình và kế hoạch bảo trì công trình trước bàn giao phục vụ thiết lập quy định bảo trì trong Quy trình bàn giao, bảo trì mới.');
  
  var qE1_1 = form.addMultipleChoiceItem().setTitle('E1.1. Đơn vị hiện có lập quy trình bảo trì công trình trước khi đưa vào sử dụng không?');
  qE1_1.setChoices([qE1_1.createChoice('Có, do nhà thầu thiết kế lập, Chủ đầu tư phê duyệt'), qE1_1.createChoice('Có, nhưng lập sau khi bàn giao đưa vào sử dụng'), qE1_1.createChoice('Chưa lập quy trình bảo trì riêng'), qE1_1.createChoice('Chưa có quy định bắt buộc lập quy trình bảo trì')]);

  var qE1_2 = form.addMultipleChoiceItem().setTitle('E1.2. Kế hoạch bảo trì hàng năm (nội dung bảo trì, thời gian, phương thức, dự toán chi phí) có được lập không?');
  qE1_2.setChoices([qE1_2.createChoice('Có lập đầy đủ theo kế hoạch'), qE1_2.createChoice('Có lập nhưng không đầy đủ'), qE1_2.createChoice('Chi sửa chữa khi phát sinh hư hỏng'), qE1_2.createChoice('Không có')]);

  var qE1_3 = form.addCheckboxItem().setTitle('E1.3. Hồ sơ bảo trì công trình hiện đang lưu trữ những tài liệu gì? (chọn nhiều)');
  qE1_3.setChoices([
    qE1_3.createChoice('Quy trình bảo trì được phê duyệt'),
    qE1_3.createChoice('Bản vẽ hoàn công'),
    qE1_3.createChoice('Lý lịch thiết bị lắp đặt trong công trình'),
    qE1_3.createChoice('Kết quả kiểm tra định kỳ'),
    qE1_3.createChoice('Kết quả bảo dưỡng, sửa chữa'),
    qE1_3.createChoice('Kết quả kiểm định/quan trắc công trình'),
    qE1_3.createChoice('Chưa xây dựng hồ sơ bảo trì hệ thống')
  ]);

  // E2
  form.addSectionHeaderItem().setTitle('E2. Đánh giá an toàn công trình')
      .setHelpText('Mục đích khảo sát: Xác định thực trạng kiểm tra, đánh giá định kỳ mức độ an toàn chịu lực và vận hành của công trình để đưa vào quy định kiểm soát chất lượng.');

  var qE2_1 = form.addMultipleChoiceItem().setTitle('E2.1. Đơn vị đã thực hiện đánh giá an toàn công trình định kỳ cho công trình nào chưa?');
  qE2_1.setChoices([qE2_1.createChoice('Có, đã thực hiện'), qE2_1.createChoice('Chưa thực hiện'), qE2_1.createChoice('Chưa có kế hoạch thực hiện đánh giá an toàn định kỳ')]);

  var qE2_2 = form.addMultipleChoiceItem().setTitle('E2.2. Công trình do VICEM Hà Tiên quản lý có thuộc danh mục phải đánh giá an toàn do cơ quan nhà nước ban hành không?');
  qE2_2.setChoices([qE2_2.createChoice('Có'), qE2_2.createChoice('Không'), qE2_2.createChoice('Chưa rõ')]);

  // E3
  form.addSectionHeaderItem().setTitle('E3. Phòng cháy chữa cháy và nghiệm thu nhà nước')
      .setHelpText('Mục đích khảo sát: Khảo sát mức độ tuân thủ các điều kiện nghiệm thu phòng cháy chữa cháy và nghiệm thu của cơ quan chuyên môn về xây dựng.');

  var qE3_1 = form.addMultipleChoiceItem().setTitle('E3.1. Trong các dự án gần đây, cơ quan nhà nước có tiến hành kiểm tra nghiệm thu không?');
  qE3_1.setChoices([qE3_1.createChoice('Có, kiểm tra đầy đủ bao gồm phòng cháy chữa cháy'), qE3_1.createChoice('Có kiểm tra nhưng không bao gồm nội dung phòng cháy chữa cháy'), qE3_1.createChoice('Chưa có công trình thuộc diện kiểm tra nghiệm thu nhà nước'), qE3_1.createChoice('Không rõ')]);

  var qE3_2 = form.addMultipleChoiceItem().setTitle('E3.2. Công trình có phải xin văn bản chấp thuận phòng cháy chữa cháy trước khi nghiệm thu hoàn thành không?');
  qE3_2.setChoices([qE3_2.createChoice('Có, đã thực hiện đầy đủ'), qE3_2.createChoice('Không thuộc diện phải xin văn bản chấp thuận'), qE3_2.createChoice('Chưa rõ quy trình thực hiện')]);

  // E4
  form.addSectionHeaderItem().setTitle('E4. Số hóa trong quản lý chất lượng')
      .setHelpText('Mục đích khảo sát: Đánh giá khả năng chuyển đổi sang nhật ký thi công điện tử và nghiệm thu điện tử trong Quy trình 16 và Quy trình 161.');

  var qE4_1 = form.addMultipleChoiceItem().setTitle('E4.1. Nhật ký thi công công trình hiện đang ở dạng nào?');
  qE4_1.setChoices([qE4_1.createChoice('Sổ giấy viết tay'), qE4_1.createChoice('Tệp văn bản trên máy tính'), qE4_1.createChoice('Phần mềm nhật ký điện tử chuyên dụng'), qE4_1.createChoice('Kết hợp nhiều dạng')]);

  var qE4_2 = form.addMultipleChoiceItem().setTitle('E4.2. Biên bản nghiệm thu công việc hiện đang ở dạng nào?');
  qE4_2.setChoices([qE4_2.createChoice('Bản giấy ký tay trực tiếp'), qE4_2.createChoice('Tệp văn bản in ra ký tay'), qE4_2.createChoice('Biên bản điện tử có áp dụng chữ ký số'), qE4_2.createChoice('Kết hợp nhiều dạng')]);

  var qE4_3 = form.addMultipleChoiceItem().setTitle('E4.3. Đơn vị sẵn sàng áp dụng nhật ký thi công điện tử và biên bản nghiệm thu điện tử (sử dụng chữ ký số) ở mức độ nào?');
  qE4_3.setChoices([qE4_3.createChoice('1 — Chưa sẵn sàng (chưa trang bị chữ ký số cho nhân sự trực tiếp)'), qE4_3.createChoice('2 — Đã có chữ ký số nhưng chưa ban hành quy trình áp dụng'), qE4_3.createChoice('3 — Có thể triển khai áp dụng trong vòng 6 tháng'), qE4_3.createChoice('4 — Sẵn sàng áp dụng ngay')]);

  // E5
  form.addSectionHeaderItem().setTitle('E5. Lưu trữ hồ sơ hoàn thành công trình')
      .setHelpText('Mục đích khảo sát: Rà soát thời hạn và định dạng lưu trữ thực tế làm căn cứ đề xuất sửa đổi Quy trình 161 (Số hóa và lưu trữ) phù hợp thời hạn quy định bắt buộc mới.');

  var qE5_1 = form.addMultipleChoiceItem().setTitle('E5.1. Hồ sơ hoàn thành công trình hiện lưu trữ ở dạng nào?');
  qE5_1.setChoices([qE5_1.createChoice('Chỉ lưu trữ bản giấy gốc'), qE5_1.createChoice('Lưu trữ bản giấy + bản quét định dạng tài liệu số (PDF)'), qE5_1.createChoice('Lưu trữ bản giấy + bản tài liệu số có chứng thực'), qE5_1.createChoice('Chưa thống nhất phương thức lưu trữ')]);
  form.addTextItem().setTitle('E5.2. Thời hạn lưu trữ hồ sơ hoàn thành công trình đang áp dụng? (nếu theo quy định nội bộ, ghi rõ số năm vào câu trả lời)');

  // E6
  form.addSectionHeaderItem().setTitle('E6. Quyết toán dự án')
      .setHelpText('Mục đích khảo sát: Đánh giá thời gian lập báo cáo quyết toán thực tế và các rào cản tranh chấp hợp đồng phục vụ cập nhật Quy trình 18 (Quyết toán dự án hoàn thành) đáp ứng thực tế hoạt động.');

  var qE6_1 = form.addMultipleChoiceItem().setTitle('E6.1. Thời gian trung bình từ khi bàn giao công trình đến khi nộp hồ sơ quyết toán cho cơ quan thẩm tra quyết toán?');
  qE6_1.setChoices([qE6_1.createChoice('Dưới 4 tháng'), qE6_1.createChoice('Từ 4 đến 9 tháng'), qE6_1.createChoice('Từ 9 đến 12 tháng'), qE6_1.createChoice('Trên 12 tháng'), qE6_1.createChoice('Chưa có dự án nào hoàn thành quyết toán')]);

  var qE6_2 = form.addMultipleChoiceItem().setTitle('E6.2. Đã gặp trường hợp nhà thầu không hợp tác quyết toán hợp đồng chưa?');
  qE6_2.setChoices([qE6_2.createChoice('Chưa gặp'), qE6_2.createChoice('Có gặp và đã giải quyết xong'), qE6_2.createChoice('Có gặp và hiện đang tồn đọng vướng mắc'), qE6_2.createChoice('Không áp dụng')]);

  var qE6_3 = form.addMultipleChoiceItem().setTitle('E6.3. Dự án của đơn vị có thuộc diện kiểm toán quyết toán bắt buộc (Dự án quan trọng quốc gia hoặc dự án nhóm A) không?');
  qE6_3.setChoices([qE6_3.createChoice('Có'), qE6_3.createChoice('Không'), qE6_3.createChoice('Chưa rõ')]);

  // -------------------------------------------------------------------------
  // PHẦN F: NHẬN THỨC PHÁP LÝ VÀ KỲ VỌNG
  // -------------------------------------------------------------------------
  var sectionF = form.addPageBreakItem()
      .setTitle('PHẦN F: NHẬN THỨC PHÁP LÝ VÀ KỲ VỌNG')
      .setHelpText('Mục đích khảo sát: Đo lường mức độ nhận biết của cán bộ về những thay đổi cốt lõi của Luật Xây dựng 135/2025 và thu thập kỳ vọng cải tiến đối với hệ thống quy chế mới.');

  var qF1 = form.addMultipleChoiceItem().setTitle('F1. Anh/chị đã nắm được các thay đổi của Luật Xây dựng 135/2025 (có hiệu lực từ 01/07/2026)?');
  qF1.setChoices([qF1.createChoice('Chưa biết'), qF1.createChoice('Biết có luật mới nhưng chưa nghiên cứu chi tiết'), qF1.createChoice('Đã đọc văn bản nhưng chưa rõ ảnh hưởng đến công việc thực tế'), qF1.createChoice('Đã nghiên cứu và hiểu rõ các điểm ảnh hưởng đến chuyên môn')]);

  var qF2 = form.addCheckboxItem().setTitle('F2. Theo anh/chị, quy trình nào hiện đang có rủi ro pháp lý cao nhất nếu không cập nhật kịp thời trước ngày 01/07/2026? (chọn tối đa 3)');
  qF2.setChoices([
    qF2.createChoice('Quy trình 34 — Quản lý dự án tổng thể'),
    qF2.createChoice('Quy trình 35 — Lựa chọn nhà thầu và ký kết hợp đồng'),
    qF2.createChoice('Quy trình 36 — Quản lý chất lượng giai đoạn chuẩn bị đầu tư'),
    qF2.createChoice('Quy trình 37 — Quản lý thực hiện hợp đồng'),
    qF2.createChoice('Quy trình 16 — Quản lý chất lượng trong hoạt động đầu tư xây dựng'),
    qF2.createChoice('Quy trình 17 — Thanh, quyết toán hợp đồng'),
    qF2.createChoice('Quy trình 18 — Quyết toán dự án hoàn thành'),
    qF2.createChoice('Quy trình 161 — Số hóa và lưu trữ tài liệu')
  ]);

  form.addParagraphTextItem().setTitle('F3. Lý do đánh giá rủi ro pháp lý cao:');
  form.addParagraphTextItem().setTitle('F4. Kỳ vọng chính của anh/chị đối với bộ quy chế quản lý dự án mới? (mô tả ngắn)');
  form.addParagraphTextItem().setTitle('F5. Link tài liệu đính kèm bổ sung (nếu có - quy chế nội bộ, biểu mẫu...):');

  // -------------------------------------------------------------------------
  // PHẦN G: MÔ HÌNH TỔ CHỨC BAN QUẢN LÝ DỰ ÁN & PHÂN CẤP ỦY QUYỀN
  // -------------------------------------------------------------------------
  var sectionG = form.addPageBreakItem()
      .setTitle('PHẦN G: MÔ HÌNH TỔ CHỨC BAN QUẢN LÝ DỰ ÁN & PHÂN CẤP ỦY QUYỀN')
      .setHelpText('Mục đích khảo sát: Thu thập số liệu định lượng và ý kiến đóng góp làm cơ sở thực tế để đề xuất mô hình tổ chức Ban QLDA, Ma trận phân cấp quyết định và Quy chế phối hợp ma trận giữa Ban QLDA và Công ty.');

  var qG1 = form.addCheckboxItem().setTitle('G1. Theo anh/chị, mô hình hoạt động trực thuộc hiện tại của Ban Quản lý dự án đang gặp khó khăn/nhược điểm lớn nhất là gì? (Chọn nhiều)')
      .setHelpText('Mục đích khảo sát: Làm rõ điểm nghẽn và hạn chế của mô hình trực thuộc hiện tại phục vụ đề xuất phương án tái cấu trúc cơ cấu tổ chức Ban QLDA.');
  qG1.setChoices([
    qG1.createChoice('Chức năng nhiệm vụ chồng chéo với các phòng ban Công ty (Phòng Tài chính Kế toán, Phòng Kiểm tra Pháp chế, Phòng Kế hoạch Chiến lược, Các Tổ Thẩm định)'),
    qG1.createChoice('Quy trình trình duyệt, phê duyệt qua nhiều cấp trung gian kéo dài thời gian thực hiện'),
    qG1.createChoice('Ban Quản lý dự án thiếu tính chủ động do hạn mức phân cấp phê duyệt quá thấp'),
    qG1.createChoice('Cơ chế quản lý chi phí Ban Quản lý dự án chưa tạo động lực cho cán bộ nhân sự'),
    qG1.createChoice('Năng lực chuyên môn của một số bộ phận chưa đáp ứng yêu cầu công việc phức tạp/ứng dụng mô hình thông tin công trình'),
    qG1.createChoice('Khác')
  ]);

  var qG2 = form.addMultipleChoiceItem().setTitle('G2. Theo anh/chị, hạn mức phân cấp phê duyệt của Giám đốc Ban Quản lý dự án hiện nay đã hợp lý chưa? (Đặc biệt là hạn mức phê duyệt hồ sơ thiết kế, dự toán, chỉ định thầu, xử lý phát sinh, phê duyệt thanh toán...)')
      .setHelpText('Mục đích khảo sát: Đánh giá tính hợp lý của hạn mức phê duyệt hiện hành để làm căn cứ thiết lập hạn mức trong Ma trận phân cấp quyết định mới.');
  qG2.setChoices([
    qG2.createChoice('Rất hợp lý, cần duy trì để kiểm soát rủi ro'),
    qG2.createChoice('Tương đối hợp lý, nhưng có thể tăng nhẹ hạn mức phê duyệt thanh toán và xử lý phát sinh nhỏ'),
    qG2.createChoice('Chưa hợp lý, cần phân cấp mạnh hơn cho Giám đốc Ban Quản lý dự án để tự quyết và tự chịu trách nhiệm'),
    qG2.createChoice('Ý kiến khác')
  ]);

  var qG3 = form.addMultipleChoiceItem().setTitle('G3. Sự phối hợp ngang giữa Ban Quản lý dự án và các phòng ban chuyên môn cấp Công ty (Phòng Tài chính Kế toán, Phòng Kiểm tra Pháp chế, Phòng Kế hoạch Chiến lược, Các Tổ Thẩm định) hiện nay:');
  qG3.setChoices([qG3.createChoice('Rất trơn tru, không có ách tắc'), qG3.createChoice('Bình thường, thỉnh thoảng có trễ thời gian xử lý thủ tục'), qG3.createChoice('Thường xuyên bị chậm trễ do thiếu quy chế phối hợp ma trận và phân định trách nhiệm rõ ràng'), qG3.createChoice('Khác')]);

  var qG3_1 = form.addMultipleChoiceItem().setTitle('G3.1. Thời gian xử lý trung bình đối với một hồ sơ trình duyệt từ Ban Quản lý dự án lên các phòng ban Công ty (thẩm định thiết kế, dự toán, kế hoạch lựa chọn nhà thầu, thanh toán...) thường kéo dài bao lâu?')
      .setHelpText('Mục đích khảo sát: Đo lường thời gian trễ trung bình của quy trình trình duyệt ngang phục vụ thiết kế thời hạn xử lý (SLA) trong quy chế phối hợp.');
  qG3_1.setChoices([qG3_1.createChoice('Dưới 3 ngày làm việc'), qG3_1.createChoice('Từ 3 đến 7 ngày làm việc'), qG3_1.createChoice('Từ 7 đến 15 ngày làm việc'), qG3_1.createChoice('Trên 15 ngày làm việc')]);

  var qG3_2 = form.addCheckboxItem().setTitle('G3.2. Nội dung nào trong hồ sơ trình duyệt thường bị yêu cầu sửa đổi, giải trình hoặc bị trả về nhiều nhất? (chọn tối đa 2)')
      .setHelpText('Mục đích khảo sát: Nhận diện các loại hồ sơ hay gặp vướng mắc nhất để tập trung chuẩn hóa biểu mẫu trình duyệt tương ứng.');
  qG3_2.setChoices([
    qG3_2.createChoice('Thiết kế kỹ thuật / Bản vẽ thi công'),
    qG3_2.createChoice('Dự toán / Giá gói thầu'),
    qG3_2.createChoice('Hồ sơ mời thầu / Kế hoạch lựa chọn nhà thầu'),
    qG3_2.createChoice('Hồ sơ phát sinh, thay đổi thiết kế / Phụ lục hợp đồng'),
    qG3_2.createChoice('Chứng từ thanh toán, quyết toán'),
    qG3_2.createChoice('Khác')
  ]);

  var qG4 = form.addMultipleChoiceItem().setTitle('G4. Để đáp ứng các quy định mới của Luật Xây dựng 135/2025 (quy định về Ban Quản lý dự án chuyên ngành/khu vực), anh/chị đề xuất mô hình tổ chức nào cho Ban Quản lý dự án VICEM Hà Tiên?');
  qG4.setChoices([
    qG4.createChoice('Mô hình Ban Quản lý dự án chuyên ngành / Ban Quản lý dự án khu vực (có tư cách pháp nhân độc lập, tự chủ tài chính, con dấu riêng)'),
    qG4.createChoice('Mô hình Ban Quản lý dự án trực thuộc Công ty (không có tư cách pháp nhân, là đơn vị phụ thuộc nhưng được phân cấp ủy quyền mạnh mẽ)'),
    qG4.createChoice('Chủ đầu tư trực tiếp quản lý dự án (sử dụng bộ máy chuyên môn của Công ty kiêm nhiệm điều hành dự án)'),
    qG4.createChoice('Khác')
  ]);

  var qG4_1 = form.addMultipleChoiceItem().setTitle('G4.1. Theo anh/chị, các dự án đầu tư xây dựng tại VICEM Hà Tiên hiện nay chủ yếu được phân loại áp dụng theo nguồn vốn nào để xác định thẩm quyền phê duyệt?')
      .setHelpText('Mục đích khảo sát: Đánh giá nhận thức về phân loại nguồn vốn đầu tư để đối chiếu với các yêu cầu phân cấp phê duyệt dự án theo Luật Xây dựng 135/2025.');
  qG4_1.setChoices([
    qG4_1.createChoice('Vốn đầu tư công'),
    qG4_1.createChoice('Vốn nhà nước ngoài đầu tư công'),
    qG4_1.createChoice('Vốn khác (vốn tự có của doanh nghiệp, vốn vay thương mại...)'),
    qG4_1.createChoice('Chưa phân định rõ ràng trong quy trình nội bộ')
  ]);

  var qG5 = form.addMultipleChoiceItem().setTitle('G5. Ý kiến của anh/chị về việc chuyển giao Tổ Chuyên gia đánh giá Hồ sơ dự thầu về trực thuộc quản lý trực tiếp của Ban Quản lý dự án (thay vì cấp Công ty như hiện nay)?');
  qG5.setChoices([
    qG5.createChoice('Rất đồng ý, giúp tăng tính chủ động, đồng bộ và đẩy nhanh tiến độ đấu thầu'),
    qG5.createChoice('Đồng ý, nhưng cần có cơ chế kiểm soát chéo từ Phòng Kiểm tra Pháp chế Công ty để tránh rủi ro pháp lý'),
    qG5.createChoice('Không đồng ý, nên duy trì độc lập ở cấp Công ty để đảm bảo khách quan'),
    qG5.createChoice('Khác')
  ]);

  var qG5_1 = form.addMultipleChoiceItem().setTitle('G5.1. Anh/chị đánh giá thế nào về năng lực chuyên môn và chứng chỉ hành nghề của các nhân sự tham gia Tổ Chuyên gia đánh giá Hồ sơ dự thầu hiện nay khi xử lý các gói thầu xây lắp/thiết bị chuyên sâu hoặc gói thầu yêu cầu mô hình thông tin công trình?')
      .setHelpText('Mục đích khảo sát: Đánh giá năng lực chuyên môn của Tổ Chuyên gia phục vụ xây dựng cơ chế giám sát/kiểm soát chất lượng khi chuyển giao về Ban QLDA.');
  qG5_1.setChoices([
    qG5_1.createChoice('Đáp ứng tốt mọi yêu cầu công việc'),
    qG5_1.createChoice('Đáp ứng cơ bản, nhưng gặp khó khăn ở các gói thầu công nghệ/thiết bị chuyên sâu hoặc có mô hình thông tin công trình'),
    qG5_1.createChoice('Chưa đáp ứng tốt, cần đào tạo và bổ sung nhân sự chuyên trách chất lượng cao'),
    qG5_1.createChoice('Ý kiến khác')
  ]);

  // Bật thu thập địa chỉ email để quản lý đối tượng phản hồi
  form.setCollectEmail(true);

  // In các đường link ra log để người chạy script lấy
  Logger.log('Tạo Form thành công!');
  Logger.log('Đường dẫn chỉnh sửa (Edit URL): ' + form.getEditUrl());
  Logger.log('Đường dẫn gửi khảo sát (Published URL): ' + form.getPublishedUrl());
}

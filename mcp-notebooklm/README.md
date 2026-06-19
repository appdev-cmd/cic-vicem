# NotebookLM MCP Server

Kết nối Claude với Google NotebookLM qua browser automation (Playwright).

**Notebook mặc định:** `ee0bf3a9-f7dd-4ee4-bd3d-6b5ebf39f8f6`

---

## Cài đặt

### Bước 1 — Chạy setup

```bat
setup.bat
```

Hoặc thủ công:

```bat
pip install mcp[cli] playwright
playwright install chromium
```

### Bước 2 — Thêm vào Claude Desktop config

Mở file:
```
C:\Users\nguye\AppData\Roaming\Claude\claude_desktop_config.json
```

Thêm vào phần `mcpServers`:

```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "python",
      "args": ["D:\\01_Projects\\cic-vicem\\mcp-notebooklm\\server.py"]
    }
  }
}
```

Nếu file chưa tồn tại, tạo mới với nội dung trên.

### Bước 3 — Khởi động lại Claude Desktop

Đóng và mở lại ứng dụng Claude.

### Bước 4 — Đăng nhập Google (lần đầu)

Khi Claude gọi tool lần đầu, một cửa sổ Chrome sẽ mở ra. Đăng nhập Google như bình thường. Session được lưu tự động — từ lần sau chạy headless (không hiện cửa sổ).

---

## Các công cụ (Tools)

| Tool | Mô tả |
|------|-------|
| `notebook_info` | Thông tin tổng quan notebook |
| `query_notebook(question)` | Hỏi AI về nội dung notebook |
| `list_sources` | Liệt kê nguồn tài liệu |
| `list_notes` | Liệt kê ghi chú |
| `get_page_content` | Lấy toàn bộ text trang (debug) |
| `take_screenshot` | Chụp màn hình notebook |
| `reload_notebook` | Tải lại trang |

---

## Lưu ý quan trọng

- **Không có API chính thức**: NotebookLM chưa cung cấp public API. Server này dùng browser automation → có thể bị ảnh hưởng nếu Google thay đổi giao diện.
- **Session lưu tại**: `~/.notebooklm-mcp/chrome_profile/`
- **Đổi notebook**: Sửa `NOTEBOOK_URL` trong `server.py` dòng 15–16.
- **Debug**: Dùng tool `take_screenshot` để xem trạng thái hiện tại của trang.

---

## Xử lý lỗi thường gặp

**"Không tìm thấy ô nhập câu hỏi"**  
→ Google có thể đã thay đổi giao diện. Dùng `get_page_content` để xem DOM hiện tại, rồi báo lại để cập nhật selector.

**"Hết thời gian chờ đăng nhập"**  
→ Xóa thư mục `~/.notebooklm-mcp/chrome_profile/` và thử lại.

**Server không khởi động**  
→ Chạy thủ công: `python server.py` để xem lỗi.

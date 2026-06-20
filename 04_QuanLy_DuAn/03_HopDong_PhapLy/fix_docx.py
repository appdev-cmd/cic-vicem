"""
Cập nhật nội dung DOCX từ file .bak.docx (gốc, đúng format)
bằng cách thay thế text trực tiếp trong XML, KHÔNG làm thay đổi format.
"""
import zipfile, shutil, os, tempfile, re
from lxml import etree
from copy import deepcopy

INPUT  = "2026.06.18 HĐ013. CIC-HT1-TuvanQuyCheDauTu (Final).bak.docx"
OUTPUT = "2026.06.18 HĐ013. CIC-HT1-TuvanQuyCheDauTu (Final)_UPDATED.docx"

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
XML = "http://www.w3.org/XML/1998/namespace"

# ── Danh sách thay thế: (tìm, thay) ────────────────────────────────────────
# Thứ tự quan trọng: phrase dài/cụ thể trước, term ngắn sau
REPLACEMENTS = [
    # ── Xóa nội dung theo comment người dùng ────────────────────────────
    # Điều 3 - sản phẩm 3: bỏ danh sách chi tiết rủi ro
    (" (Sổ đăng ký rủi ro, Sổ tay quản lý rủi ro dự án, Ma trận rủi ro toàn công ty)", ""),
    # Điều 3 - sản phẩm 4: bỏ kế hoạch triển khai 3 năm
    ("Kế hoạch triển khai áp dụng và đào tạo, chuyển giao: kế hoạch triển khai áp dụng trong 03 năm; bộ",
     "Kế hoạch đào tạo và chuyển giao: bộ"),
    # Phụ lục 1 mục 4: bỏ danh sách chi tiết rủi ro
    (" (Risk Register cho các nhóm pháp lý, thiết kế, đấu thầu, thi công, môi trường, hợp đồng, thanh–quyết toán; Sổ tay quản lý rủi ro dự án; Ma trận rủi ro toàn công ty)", ""),
    # Bảng PL2 cột kết quả: bỏ "Kế hoạch triển khai áp dụng 03 năm và"
    ("+ Kế hoạch triển khai áp dụng 03 năm và bộ tài liệu đào tạo, tập huấn.",
     "+ Bộ tài liệu đào tạo, tập huấn."),
    # Mục 2.5: bỏ "và Kế hoạch triển khai áp dụng 03 năm"
    (" và Kế hoạch triển khai áp dụng 03 năm", ""),

    # ── Phrase dài/cụ thể trước ──────────────────────────────────────────
    # SOP – phrase dài nhất trước
    ("chuẩn hóa toàn bộ quy trình SOP ĐTXD",
     "chuẩn hóa toàn bộ quy trình vận hành chuẩn Đầu tư Xây dựng"),
    ("bộ quy trình SOP đầu tư xây dựng chuẩn hóa",
     "bộ quy trình vận hành chuẩn Đầu tư Xây dựng được chuẩn hóa"),
    ("bộ quy trình SOP đầu tư xây dựng",
     "bộ quy trình vận hành chuẩn Đầu tư Xây dựng"),
    ("bộ quy trình SOP chuẩn hóa",
     "bộ quy trình vận hành chuẩn được chuẩn hóa"),
    ("Bộ SOP ĐTXD",
     "Bộ quy trình vận hành chuẩn Đầu tư Xây dựng"),
    ("SOP ĐTXD",         "quy trình vận hành chuẩn Đầu tư Xây dựng"),
    ("Bộ SOP ",          "Bộ quy trình vận hành chuẩn "),
    ("chuẩn hóa quy trình SOP",  "chuẩn hóa quy trình vận hành chuẩn"),
    ("SOP Đầu tư Xây dựng",      "quy trình vận hành chuẩn Đầu tư Xây dựng"),
    ("trình SOP",        "trình vận hành chuẩn"),
    ("Bộ SOP",           "Bộ quy trình vận hành chuẩn"),
    (" SOP ",            " quy trình vận hành chuẩn "),

    # KPI – phrase dài nhất trước
    ("bộ chỉ số KPI quản lý dự án",
     "bộ chỉ số đánh giá hiệu suất chính trong quản lý dự án"),
    ("hệ thống KPI quản lý dự án",
     "hệ thống chỉ số đánh giá hiệu suất chính trong quản lý dự án"),
    ("Xây dựng hệ thống KPI quản lý dự án",
     "Xây dựng hệ thống chỉ số đánh giá hiệu suất chính trong quản lý dự án"),
    ("Bộ chỉ số KPI quản lý dự án",
     "Bộ chỉ số đánh giá hiệu suất chính trong quản lý dự án"),
    ("hệ thống KPI",     "hệ thống chỉ số đánh giá hiệu suất chính"),
    ("+ Bộ KPI",         "+ Bộ chỉ số đánh giá hiệu suất"),
    ("Bộ KPI",           "Bộ chỉ số đánh giá hiệu suất"),
    ("KPI,",             "chỉ số đánh giá hiệu suất,"),
    ("KPI;",             "chỉ số đánh giá hiệu suất;"),
    (" KPI ",            " chỉ số đánh giá hiệu suất "),

    # SPI, CPI, NPV, IRR
    ("Tiến độ: SPI;",    "Tiến độ: Chỉ số hiệu suất tiến độ;"),
    ("Tiến độ: SPI,",    "Tiến độ: Chỉ số hiệu suất tiến độ,"),
    ("Chi phí: CPI;",    "Chi phí: Chỉ số hiệu suất chi phí;"),
    ("Chi phí: CPI,",    "Chi phí: Chỉ số hiệu suất chi phí,"),
    ("; NPV;",           "; Giá trị hiện tại ròng;"),
    (": NPV,",           ": Giá trị hiện tại ròng,"),
    ("tư: NPV;",         "tư: Giá trị hiện tại ròng;"),
    (", IRR,",           ", Tỷ suất hoàn vốn nội bộ,"),
    ("; IRR;",           "; Tỷ suất hoàn vốn nội bộ;"),

    # RACI
    ("Ma trận RACI",    "Ma trận phân công trách nhiệm (Thực hiện – Phê duyệt – Tư vấn – Thông báo)"),
    ("ma trận RACI",    "ma trận phân công trách nhiệm (Thực hiện – Phê duyệt – Tư vấn – Thông báo)"),

    # BIM
    ("BIM và Môi trường Dữ liệu Chung",
     "Mô hình Thông tin Công trình và Môi trường Dữ liệu Chung"),
    ("áp dụng BIM đối với",
     "áp dụng Mô hình Thông tin Công trình đối với"),
    ("BIM đối với dự án lớn",
     "Mô hình Thông tin Công trình đối với dự án lớn"),
    (", BIM ",           ", Mô hình Thông tin Công trình "),

    # PMIS / dashboard / workflow
    ("Định hướng PMIS",  "Định hướng Hệ thống Thông tin Quản lý Dự án"),
    ("định hướng PMIS",  "định hướng Hệ thống Thông tin Quản lý Dự án"),
    ("dashboard lãnh đạo",
     "bảng theo dõi tổng quan cho lãnh đạo"),
    ("sơ đồ luồng công việc (workflow)",
     "sơ đồ luồng công việc"),
    ("; workflow",       "; sơ đồ luồng công việc"),
    ("workflow;",        "sơ đồ luồng công việc;"),
    (" workflow",        " sơ đồ luồng công việc"),

    # SWOT
    ("kèm phân tích SWOT",
     "kèm phân tích Điểm mạnh – Điểm yếu – Cơ hội – Thách thức"),
    ("phân tích SWOT",
     "phân tích Điểm mạnh – Điểm yếu – Cơ hội – Thách thức"),

    # SAP/ERP
    ("tích hợp SAP/ERP nếu có",
     "tích hợp Hệ thống Hoạch định Nguồn lực Doanh nghiệp nếu có"),
    ("SAP/ERP",          "Hệ thống Hoạch định Nguồn lực Doanh nghiệp"),

    # Risk Register
    ("Risk Register",   "Sổ đăng ký rủi ro"),
    # ISO
    ("theo định hướng tiêu chuẩn ISO",
     "theo định hướng Tiêu chuẩn Quản lý Quốc tế (ISO)"),
    ("theo định hướng ISO",
     "theo định hướng Tiêu chuẩn Quản lý Quốc tế (ISO)"),
    # Ban QLDA
    ("Ban QLDA",        "Ban Quản lý dự án"),
    # Fax
    ("văn bản (Fax)",   "văn bản (qua fax hoặc phương tiện tương đương)"),
    # GTGT – phrase trước term
    ("Hóa đơn giá trị gia tăng hợp lệ;",
     "Hóa đơn thuế Giá trị gia tăng hợp lệ;"),
    ("Thuế GTGT",       "Thuế Giá trị gia tăng"),
    ("thuế GTGT",       "thuế Giá trị gia tăng"),
    ("thuế suất GTGT",  "thuế suất Giá trị gia tăng"),
    # SPI, CPI, NPV, IRR (trong ngoặc KPI – chỉ xuất hiện 1 lần)
    ("Tiến độ: SPI,",   "Tiến độ: Chỉ số hiệu suất tiến độ,"),
    ("Chi phí: CPI,",   "Chi phí: Chỉ số hiệu suất chi phí,"),
    (": NPV,",          ": Giá trị hiện tại ròng,"),
    (", IRR,",          ", Tỷ suất hoàn vốn nội bộ,"),
    # CĐS
    ("lộ trình CĐS",    "lộ trình chuyển đổi số"),

    # ── Term ngắn (sau cùng) ────────────────────────────────────────────
    ("ĐTXD",            "Đầu tư Xây dựng"),
    ("HĐQT",            "Hội đồng quản trị"),
    ("TMĐT",            "Tổng mức đầu tư"),
]

# ── Hàm lấy toàn bộ text của paragraph ────────────────────────────────────
def para_text(p):
    return "".join(t.text or "" for t in p.iter(f"{{{W}}}t"))

# ── Hàm thay thế text trong một w:t element ───────────────────────────────
def replace_in_t(t_elem, replacements):
    if not t_elem.text:
        return False
    original = t_elem.text
    new = original
    for old, new_val in replacements:
        new = new.replace(old, new_val)
    if new != original:
        t_elem.text = new
        # Đảm bảo space được preserve nếu có khoảng trắng đầu/cuối
        if new.startswith(" ") or new.endswith(" "):
            t_elem.set(f"{{{XML}}}space", "preserve")
        return True
    return False

# ── Hàm rebuild paragraph từ text mới (dùng khi text span nhiều runs) ─────
def rebuild_para(p, new_text, replacements):
    """
    Khi một phrase trải qua nhiều w:r (runs), ta cần merge runs.
    Giữ lại định dạng của run đầu tiên (bold/italic/font của run đầu).
    """
    ns = {"w": W}
    runs = p.findall("w:r", ns)
    if not runs:
        return

    # Lưu rPr của run đầu tiên
    first_run = runs[0]
    first_rpr = first_run.find("w:rPr", ns)

    # Xóa tất cả runs cũ
    for r in runs:
        p.remove(r)

    # Tạo run mới với rPr của run đầu và text mới
    new_r = etree.SubElement(p, f"{{{W}}}r")
    if first_rpr is not None:
        new_r.insert(0, deepcopy(first_rpr))
    new_t = etree.SubElement(new_r, f"{{{W}}}t")
    new_t.text = new_text
    if new_text.startswith(" ") or new_text.endswith(" "):
        new_t.set(f"{{{XML}}}space", "preserve")

# ── Xử lý toàn bộ XML ─────────────────────────────────────────────────────
def process_xml(xml_bytes, replacements):
    tree = etree.fromstring(xml_bytes)

    # Pass 1: thay thế trực tiếp trong từng w:t (an toàn nhất)
    for t in tree.iter(f"{{{W}}}t"):
        replace_in_t(t, replacements)

    # Pass 2: với những paragraph mà text vẫn còn cần đổi
    # (phrase span nhiều runs → cần merge)
    for p in tree.iter(f"{{{W}}}p"):
        full = para_text(p)
        new_full = full
        for old, new_val in replacements:
            new_full = new_full.replace(old, new_val)
        if new_full != full:
            rebuild_para(p, new_full, replacements)

    return etree.tostring(tree, xml_declaration=True, encoding="UTF-8", standalone=True)

# ── Main ───────────────────────────────────────────────────────────────────
def main():
    print(f"Đọc: {INPUT}")
    with zipfile.ZipFile(INPUT, "r") as zin:
        names = zin.namelist()
        files = {name: zin.read(name) for name in names}
        infos = {info.filename: info for info in zin.infolist()}

    # Xử lý document.xml
    print("Xử lý document.xml...")
    doc_xml = files["word/document.xml"]
    new_doc_xml = process_xml(doc_xml, REPLACEMENTS)
    files["word/document.xml"] = new_doc_xml

    # Ghi file output
    print(f"Ghi: {OUTPUT}")
    tmp = OUTPUT + ".tmp"
    with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as zout:
        for name in names:
            info = infos[name]
            zout.writestr(info, files[name])

    if os.path.exists(OUTPUT):
        os.remove(OUTPUT)
    os.rename(tmp, OUTPUT)
    print("File da luu:", OUTPUT)
    print("OK! Format goc duoc giu nguyen.")

if __name__ == "__main__":
    main()

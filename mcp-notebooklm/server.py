#!/usr/bin/env python3
"""
NotebookLM MCP Server
Kết nối Claude với Google NotebookLM qua browser automation (Playwright)
Notebook: https://notebooklm.google.com/notebook/ee0bf3a9-f7dd-4ee4-bd3d-6b5ebf39f8f6
"""

import asyncio
import json
import sys
import time
from pathlib import Path
from typing import Optional

from mcp.server.fastmcp import FastMCP
from playwright.async_api import async_playwright, BrowserContext, Page

# ── Cấu hình ──────────────────────────────────────────────────────────────────
NOTEBOOK_ID = "ee0bf3a9-f7dd-4ee4-bd3d-6b5ebf39f8f6"
NOTEBOOK_URL = f"https://notebooklm.google.com/notebook/{NOTEBOOK_ID}"
PROFILE_DIR  = Path.home() / ".notebooklm-mcp"
CHROME_DIR   = PROFILE_DIR / "chrome_profile"

# ── MCP server ────────────────────────────────────────────────────────────────
mcp = FastMCP("NotebookLM", description="Kết nối Claude với Google NotebookLM")

# ── Trạng thái browser (singleton) ────────────────────────────────────────────
_context: Optional[BrowserContext] = None
_page:    Optional[Page]           = None
_pw                                = None


async def ensure_page() -> Page:
    """
    Khởi động browser và điều hướng đến notebook.
    Lần đầu: mở cửa sổ browser để người dùng đăng nhập Google.
    Lần sau: dùng session đã lưu (headless).
    """
    global _context, _page, _pw

    if _page and not _page.is_closed():
        return _page

    CHROME_DIR.mkdir(parents=True, exist_ok=True)

    _pw = await async_playwright().start()

    # Kiểm tra session cũ
    session_exists = (CHROME_DIR / "Default" / "Cookies").exists()

    _context = await _pw.chromium.launch_persistent_context(
        user_data_dir=str(CHROME_DIR),
        headless=session_exists,        # headless nếu đã có session
        args=["--no-sandbox", "--disable-dev-shm-usage"],
        viewport={"width": 1280, "height": 900},
    )

    _page = await _context.new_page()
    print(f"[NotebookLM MCP] Mở notebook: {NOTEBOOK_URL}", file=sys.stderr)
    await _page.goto(NOTEBOOK_URL, wait_until="domcontentloaded", timeout=60_000)

    # Nếu bị redirect sang trang đăng nhập
    if "accounts.google.com" in _page.url or "myaccount.google.com" in _page.url:
        print("[NotebookLM MCP] ⚠ Chưa đăng nhập — hãy đăng nhập Google trong cửa sổ browser đang mở...", file=sys.stderr)
        try:
            await _page.wait_for_url(f"*notebooklm.google.com/notebook/{NOTEBOOK_ID}*", timeout=180_000)
        except Exception:
            raise RuntimeError("Hết thời gian chờ đăng nhập. Khởi động lại MCP server và thử lại.")
        await _page.wait_for_load_state("networkidle", timeout=30_000)
        print("[NotebookLM MCP] ✅ Đăng nhập thành công — session đã lưu.", file=sys.stderr)

    return _page


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _wait_for_selector_any(page: Page, selectors: list[str], timeout: int = 8_000) -> Optional[object]:
    for sel in selectors:
        try:
            el = await page.wait_for_selector(sel, timeout=timeout)
            if el:
                return el
        except Exception:
            pass
    return None


async def _get_last_assistant_message(page: Page) -> str:
    """Trích xuất tin nhắn AI mới nhất từ chat."""
    # Thử nhiều selector phổ biến của NotebookLM
    selectors = [
        ".response-container .response-text",
        "message-content:last-of-type",
        "[class*='response']:last-child",
        "[class*='ModelResponse']:last-child",
        "[class*='assistant']:last-child",
        ".chat-message:last-child",
    ]
    for sel in selectors:
        try:
            elements = await page.query_selector_all(sel)
            if elements:
                texts = [await el.inner_text() for el in elements]
                return "\n\n".join(t for t in texts if t.strip())
        except Exception:
            pass

    # Fallback: lấy toàn bộ text vùng chat
    try:
        chat_area = await page.query_selector("[class*='chat'], [class*='Chat'], main")
        if chat_area:
            return await chat_area.inner_text()
    except Exception:
        pass

    return "(Không trích xuất được phản hồi — hãy kiểm tra cửa sổ browser)"


# ── Tools ─────────────────────────────────────────────────────────────────────

@mcp.tool()
async def notebook_info() -> str:
    """Lấy thông tin tổng quan về notebook (tiêu đề, số nguồn tài liệu)."""
    page = await ensure_page()
    await page.wait_for_load_state("networkidle", timeout=20_000)

    title = await page.title()

    # Đếm số sources
    source_count = 0
    for sel in ["[data-source-id]", "[class*='source-item']", "[class*='SourceItem']", "[class*='Source']"]:
        els = await page.query_selector_all(sel)
        if els:
            source_count = len(els)
            break

    return json.dumps({
        "title": title,
        "notebook_url": NOTEBOOK_URL,
        "source_count": source_count,
    }, ensure_ascii=False, indent=2)


@mcp.tool()
async def query_notebook(question: str) -> str:
    """
    Hỏi AI của NotebookLM một câu hỏi về nội dung notebook.

    Args:
        question: Câu hỏi cần đặt ra (tiếng Việt hoặc tiếng Anh đều được)
    """
    page = await ensure_page()

    # Tìm ô nhập câu hỏi
    input_selectors = [
        "textarea[placeholder*='Ask']",
        "textarea[placeholder*='question']",
        "textarea[placeholder*='Hỏi']",
        "textarea[placeholder*='nhập']",
        "[contenteditable='true'][class*='input']",
        "textarea",
    ]
    chat_input = await _wait_for_selector_any(page, input_selectors, timeout=10_000)
    if not chat_input:
        return "❌ Không tìm thấy ô nhập câu hỏi. Kiểm tra lại giao diện NotebookLM."

    await chat_input.click()
    await chat_input.fill(question)
    await page.keyboard.press("Enter")

    # Chờ AI trả lời (theo dõi loading indicator)
    await asyncio.sleep(2)
    loading_selectors = ["[class*='loading']", "[class*='spinner']", "[class*='thinking']"]
    for _ in range(30):       # tối đa ~60s
        still_loading = False
        for sel in loading_selectors:
            els = await page.query_selector_all(sel)
            if els:
                still_loading = True
                break
        if not still_loading:
            break
        await asyncio.sleep(2)

    await asyncio.sleep(2)    # buffer thêm

    response = await _get_last_assistant_message(page)
    return response or "(Không có phản hồi)"


@mcp.tool()
async def list_sources() -> str:
    """Liệt kê tất cả nguồn tài liệu (sources) trong notebook."""
    page = await ensure_page()

    sources = []
    for sel in [
        "[data-source-id]",
        "[class*='source-item']",
        "[class*='SourceItem']",
        "[class*='SourceTitle']",
    ]:
        els = await page.query_selector_all(sel)
        if els:
            for el in els:
                text = await el.inner_text()
                if text.strip():
                    sources.append(text.strip())
            break

    if not sources:
        return "Không tìm thấy nguồn tài liệu nào (hoặc notebook đang tải)."

    return json.dumps({"count": len(sources), "sources": sources}, ensure_ascii=False, indent=2)


@mcp.tool()
async def list_notes() -> str:
    """Liệt kê tất cả ghi chú (notes/studio notes) trong notebook."""
    page = await ensure_page()

    notes = []
    for sel in [
        "[class*='note-item']",
        "[class*='StudioNote']",
        "[class*='Note']",
        "[data-note-id]",
    ]:
        els = await page.query_selector_all(sel)
        if els:
            for el in els:
                text = await el.inner_text()
                if text.strip():
                    notes.append(text.strip())
            break

    if not notes:
        return "Không tìm thấy ghi chú nào."

    return json.dumps({"count": len(notes), "notes": notes}, ensure_ascii=False, indent=2)


@mcp.tool()
async def get_page_content() -> str:
    """
    Lấy toàn bộ nội dung văn bản hiển thị trên trang (hữu ích để debug
    hoặc khi các công cụ khác không tìm được đúng vùng).
    """
    page = await ensure_page()
    content = await page.inner_text("body")
    # Giới hạn 8000 ký tự
    return content[:8000] if len(content) > 8000 else content


@mcp.tool()
async def take_screenshot() -> str:
    """
    Chụp màn hình notebook hiện tại và lưu vào thư mục ~/.notebooklm-mcp/.
    Trả về đường dẫn file ảnh.
    """
    page = await ensure_page()
    PROFILE_DIR.mkdir(exist_ok=True)
    path = PROFILE_DIR / f"screenshot_{int(time.time())}.png"
    await page.screenshot(path=str(path), full_page=False)
    return str(path)


@mcp.tool()
async def reload_notebook() -> str:
    """Tải lại trang notebook (hữu ích khi gặp lỗi hoặc trang bị treo)."""
    global _page
    page = await ensure_page()
    await page.reload(wait_until="networkidle", timeout=30_000)
    _page = page
    return "✅ Đã tải lại notebook thành công."


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    mcp.run(transport="stdio")

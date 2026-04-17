import pdfplumber
import sys
import pathlib

def convert_invoice_to_md(pdf_path):
    file_path = pathlib.Path(pdf_path)
    if not file_path.exists():
        print(f"❌ ไม่พบไฟล์: {pdf_path}")
        return

    print(f"⏳ กำลังแกะข้อมูลจาก: {pdf_path} ...")
    
    md_output = ""
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                md_output += f"## Page {i+1}\n\n"
                
                # ดึงข้อความปกติ
                text = page.extract_text()
                if text:
                    md_output += text + "\n\n"
                
                # ดึงตาราง (หัวใจสำคัญของใบ Invoice)
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        # กรองค่า None ออกและรวมเป็นแถว Markdown
                        clean_row = [str(item).replace('\n', ' ') if item else "" for item in row]
                        md_output += "| " + " | ".join(clean_row) + " |\n"
                    md_output += "\n"
                
                md_output += "---\n\n"

        # บันทึกไฟล์
        output_file = file_path.with_suffix(".md")
        output_file.write_text(md_output, encoding="utf-8")
        print(f"✅ สำเร็จ! ไฟล์อยู่ที่: {output_file}")

    except Exception as e:
        print(f"💥 พังตรงนี้: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("💡 วิธีใช้: python pdf2md_v2.py <ชื่อไฟล์.pdf>")
    else:
        convert_invoice_to_md(sys.argv[1])
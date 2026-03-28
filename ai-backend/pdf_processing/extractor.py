import PyPDF2
from io import BytesIO

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw string text from a PDF file byte stream."""
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_bytes))
        
        full_text = []
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            if text:
                full_text.append(text)
                
        return "\n\n".join(full_text)
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

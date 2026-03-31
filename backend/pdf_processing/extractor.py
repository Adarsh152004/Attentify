import io
import PyPDF2


def extract_text_from_bytes(file_bytes: bytes, filename: str = "") -> str:
    """
    Extract plain text from a PDF file given its raw bytes.
    Raises ValueError if no text can be extracted.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    pages_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages_text.append(text.strip())

    if not pages_text:
        raise ValueError(f"No extractable text found in PDF: {filename}")

    return "\n\n".join(pages_text)

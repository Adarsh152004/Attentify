def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks of approximately `chunk_size` characters.
    Tries to split on paragraph boundaries first, then on sentence boundaries.
    """
    # Prefer paragraph-level splits
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 2 <= chunk_size:
            current = (current + "\n\n" + para).strip()
        else:
            if current:
                chunks.append(current)
            # If single paragraph is too long, split by sentence
            if len(para) > chunk_size:
                sentences = para.replace(". ", ".|").split("|")
                sub_current = ""
                for sent in sentences:
                    if len(sub_current) + len(sent) + 1 <= chunk_size:
                        sub_current = (sub_current + " " + sent).strip()
                    else:
                        if sub_current:
                            chunks.append(sub_current)
                        sub_current = sent
                if sub_current:
                    current = sub_current
                else:
                    current = ""
            else:
                current = para

    if current:
        chunks.append(current)

    # Add overlap: prepend tail of previous chunk to next
    if overlap > 0 and len(chunks) > 1:
        overlapped = [chunks[0]]
        for i in range(1, len(chunks)):
            tail = chunks[i - 1][-overlap:]
            overlapped.append((tail + " " + chunks[i]).strip())
        return overlapped

    return chunks

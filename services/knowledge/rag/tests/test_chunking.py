from app.ingestion.chunker import chunk_text
from app.ingestion.parser import FrontmatterError, parse_document


def test_short_content_stays_one_chunk():
    text = "This is a short piece of career guidance content."
    chunks = chunk_text(text, chunk_size=1000, overlap=150)
    assert chunks == [text.strip()]


def test_long_content_splits_into_overlapping_chunks():
    text = "a" * 120
    chunks = chunk_text(text, chunk_size=50, overlap=10)
    assert len(chunks) == 3
    assert chunks[1].startswith("a")


def test_chunks_are_stripped_and_non_empty():
    text = "  " + ("b" * 120) + "  "
    chunks = chunk_text(text, chunk_size=50, overlap=10)
    assert all(chunk == chunk.strip() for chunk in chunks)
    assert all(chunk for chunk in chunks)


def test_parser_extracts_frontmatter_fields():
    raw = (
        "---\n"
        "source_title: Writing Resume Bullets That Show Impact\n"
        "source_url: https://example.com/resume-bullets\n"
        "source_type: resume_guide\n"
        "---\n"
        "# Heading\n"
        "Body content goes here.\n"
    )

    parsed = parse_document(raw)

    assert parsed.source_title == "Writing Resume Bullets That Show Impact"
    assert parsed.source_url == "https://example.com/resume-bullets"
    assert parsed.source_type == "resume_guide"
    assert parsed.body.startswith("# Heading")


def test_parser_raises_on_missing_frontmatter():
    raw = "# Heading\nNo frontmatter here.\n"
    try:
        parse_document(raw)
        assert False, "expected FrontmatterError"
    except FrontmatterError:
        pass


def test_parser_raises_on_missing_required_field():
    raw = (
        "---\n"
        "source_title: Missing URL Example\n"
        "source_type: resume_guide\n"
        "---\n"
        "Body.\n"
    )
    try:
        parse_document(raw)
        assert False, "expected FrontmatterError"
    except FrontmatterError:
        pass

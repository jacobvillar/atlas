"""Parse curated career-guidance Markdown into frontmatter metadata + body.

Seed files use a lightweight YAML-like frontmatter block delimited by ``---``
lines, e.g.::

    ---
    source_title: Writing Resume Bullets That Show Impact
    source_url: https://example.com/resume-bullets
    source_type: resume_guide
    ---
    # Heading
    Body content...

This module deliberately avoids a YAML dependency: the frontmatter here is
always a flat ``key: value`` mapping, so a hand-rolled parser keeps the
ingestion pipeline dependency-light and importable without any third-party
package.
"""

from __future__ import annotations

from dataclasses import dataclass


FRONTMATTER_DELIMITER = "---"

REQUIRED_FIELDS = ("source_title", "source_url", "source_type")


@dataclass(frozen=True)
class ParsedDocument:
    source_title: str
    source_url: str
    source_type: str
    body: str


class FrontmatterError(ValueError):
    """Raised when a seed document is missing or has malformed frontmatter."""


def parse_document(text: str) -> ParsedDocument:
    """Split ``text`` into frontmatter fields and the remaining body.

    Raises ``FrontmatterError`` if the frontmatter block is missing or does
    not define all of ``source_title``, ``source_url``, and ``source_type``.
    """

    lines = text.splitlines()
    if not lines or lines[0].strip() != FRONTMATTER_DELIMITER:
        raise FrontmatterError("document is missing an opening '---' frontmatter delimiter")

    closing_index = None
    for index in range(1, len(lines)):
        if lines[index].strip() == FRONTMATTER_DELIMITER:
            closing_index = index
            break

    if closing_index is None:
        raise FrontmatterError("document is missing a closing '---' frontmatter delimiter")

    frontmatter_lines = lines[1:closing_index]
    body = "\n".join(lines[closing_index + 1 :]).strip()

    fields: dict[str, str] = {}
    for raw_line in frontmatter_lines:
        line = raw_line.strip()
        if not line:
            continue
        if ":" not in line:
            raise FrontmatterError(f"malformed frontmatter line: {raw_line!r}")
        key, _, value = line.partition(":")
        fields[key.strip()] = value.strip().strip('"').strip("'")

    missing = [field for field in REQUIRED_FIELDS if not fields.get(field)]
    if missing:
        raise FrontmatterError(f"frontmatter missing required fields: {missing}")

    return ParsedDocument(
        source_title=fields["source_title"],
        source_url=fields["source_url"],
        source_type=fields["source_type"],
        body=body,
    )

"""Thin wrapper around the OpenAI embeddings API.

The ``openai`` package is imported lazily inside ``embed_texts`` so this
module (and anything that imports it) can be loaded without the package
installed. This keeps the offline test suite runnable without network
access or the OpenAI dependency.
"""

from __future__ import annotations


def embed_texts(
    texts: list[str],
    model: str,
    api_key: str | None = None,
) -> list[list[float]]:
    """Return an embedding vector for each string in ``texts``.

    ``api_key`` is passed through to the OpenAI client explicitly rather
    than relying on ambient environment state, keeping this function easy
    to test with a fake client.
    """

    from openai import OpenAI  # local import: keep openai out of module load path

    client = OpenAI(api_key=api_key) if api_key else OpenAI()
    response = client.embeddings.create(model=model, input=texts)
    return [item.embedding for item in response.data]

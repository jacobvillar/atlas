import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";

// POST /api/extract-resume — authenticated proxy to the Python document
// service. Validates the upload, forwards it for extraction, and stores only
// resume_documents metadata. Never logs extracted text or file contents
// (CLAUDE.md privacy rules).
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function expectedContentType(fileName: string) {
  const lower = fileName.toLowerCase();
  const extension = ALLOWED_EXTENSIONS.find((ext) => lower.endsWith(ext));
  return extension ? CONTENT_TYPE_BY_EXTENSION[extension] : null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documentServiceUrl = process.env.DOCUMENT_SERVICE_URL;
  if (!documentServiceUrl) {
    return NextResponse.json(
      { error: "Document service not configured" },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const expectedType = expectedContentType(file.name);
  // Browser metadata is not trusted (the Python service confirms magic bytes),
  // but a provided MIME type must agree with the filename so both services
  // select the same parser. Some browsers omit File.type, so normalize that
  // case to the trusted extension-derived type before forwarding.
  if (
    !expectedType ||
    (file.type &&
      (!ALLOWED_MIME_TYPES.has(file.type) || file.type !== expectedType))
  ) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF or DOCX resume." },
      { status: 400 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 5 MB." },
      { status: 400 },
    );
  }

  const forwardFormData = new FormData();
  const forwardFile =
    file.type === expectedType
      ? file
      : new File([file], file.name, { type: expectedType });
  forwardFormData.append("file", forwardFile, file.name);

  let extraction: { text?: string; markdown?: string; fileName?: string; fileType?: string };
  try {
    const upstreamResponse = await fetch(`${documentServiceUrl}/extract-resume`, {
      method: "POST",
      headers: process.env.DOCUMENT_SERVICE_API_KEY
        ? { "x-api-key": process.env.DOCUMENT_SERVICE_API_KEY }
        : undefined,
      body: forwardFormData,
    });

    if (!upstreamResponse.ok) {
      console.error(
        "extract-resume: document service responded with status",
        upstreamResponse.status,
      );
      return NextResponse.json(
        { error: "Extraction failed. Please paste your resume instead." },
        { status: 502 },
      );
    }

    extraction = await upstreamResponse.json();
  } catch (error) {
    console.error(
      "extract-resume: document service request failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Extraction failed. Please paste your resume instead." },
      { status: 502 },
    );
  }

  if (!extraction.text) {
    console.error("extract-resume: document service returned no text");
    return NextResponse.json(
      { error: "Extraction failed. Please paste your resume instead." },
      { status: 502 },
    );
  }

  // Metadata only — never store or log extracted text or file contents.
  const { data: resumeDocument, error: insertError } = await supabase
    .from("resume_documents")
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_type: expectedType,
      extraction_status: "completed",
    })
    .select("id")
    .single();

  if (insertError || !resumeDocument) {
    console.error("extract-resume: metadata insert failed:", insertError?.message);
    // Extraction succeeded; still return the text so the user isn't blocked,
    // just without a resumeDocumentId to link on /api/analyze.
    return NextResponse.json({ text: extraction.text, resumeDocumentId: null });
  }

  return NextResponse.json({
    text: extraction.text,
    resumeDocumentId: resumeDocument.id,
  });
}

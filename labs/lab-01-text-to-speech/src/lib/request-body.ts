import { AppError } from "@/lib/errors";

export async function readJsonBody(
  request: Request,
  maxBytes: number,
  tooLargeMessage: string,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new AppError(
      415,
      "unsupported_media_type",
      "The request Content-Type must be application/json.",
    );
  }

  const advertisedLength = readContentLength(request);
  if (advertisedLength !== undefined && advertisedLength > maxBytes) {
    throw new AppError(413, "request_too_large", tooLargeMessage);
  }

  if (!request.body) {
    throw new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new AppError(413, "request_too_large", tooLargeMessage);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    return JSON.parse(text) as unknown;
  } catch {
    throw new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }
}

function readContentLength(request: Request): number | undefined {
  const value = request.headers.get("content-length");
  if (!value || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}

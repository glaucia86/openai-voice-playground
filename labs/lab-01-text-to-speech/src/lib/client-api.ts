export type ClientApiError = {
  message: string;
  code?: string;
  requestId?: string;
};

export function authorizationHeaders(accessToken: string): HeadersInit {
  return accessToken.trim()
    ? { Authorization: `Bearer ${accessToken.trim()}` }
    : {};
}

export async function readApiError(response: Response): Promise<ClientApiError> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string; code?: string; requestId?: string };
    };

    return {
      message: body.error?.message || "The request could not be completed.",
      ...(body.error?.code ? { code: body.error.code } : {}),
      ...(body.error?.requestId ? { requestId: body.error.requestId } : {}),
    };
  } catch {
    return { message: "The request could not be completed." };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

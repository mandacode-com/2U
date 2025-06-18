import { API_BASE } from "@/lib/constants";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Uploads an image file to the server.
 * @param mid - The message ID to which the image is associated.
 * @param file - The image file to upload.
 * @param password - Optional password for the message.
 * @returns A promise that resolves to the response of the upload operation.
 */
export async function uploadImage(
  mid: string,
  file: File,
  password?: string,
): Promise<Response> {
  if (!file) {
    throw new Error("파일이 제공되지 않았습니다.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `파일 크기가 최대 허용 크기를 초과했습니다 (${MAX_FILE_SIZE / (1024 * 1024)}MB)`,
    );
  }

  const proxyForm = new FormData();
  proxyForm.append("file", file, file.name);
  if (password) {
    proxyForm.append("password", password);
  }

  return fetch(`${API_BASE}/message/${mid}/image`, {
    method: "POST",
    body: proxyForm,
  });
}

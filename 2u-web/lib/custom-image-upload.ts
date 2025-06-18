import { uploadImage } from "./api/image";
import { API_BASE } from "./constants";

export const createImageUploadHandler =
  (
    mid: string,
    password?: string,
  ): ((
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal,
  ) => Promise<string>) =>
  async (file, onProgress, abortSignal) => {
    if (!file) {
      throw new Error("파일이 제공되지 않았습니다.");
    }

    try {
      const res = await uploadImage(mid, file, password);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "업로드 실패");
      }

      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
          } else {
            onProgress({ progress });
          }
        }, 500);
      }

      return `${API_BASE}/message/${mid}/image`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "알 수 없는 오류가 발생했습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

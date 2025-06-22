"use client";

import { useState, useRef } from "react";

type Props = {
  mid: string;
  password: string;
};

export default function UploadForm({ mid, password }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      setUploading(true);
      const res = await fetch(`/api/message/${mid}/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "업로드 실패");
      }

      alert("이미지 업로드 성공");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-semibold">이미지 업로드</h2>
      <input type="file" accept="image/*" ref={fileInputRef} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "업로드 중..." : "업로드"}
      </button>
    </div>
  );
}

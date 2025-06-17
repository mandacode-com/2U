'use client';

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="bg-white text-gray-800 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">오류가 발생했습니다</h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          <pre className="bg-gray-100 text-sm text-red-500 p-4 rounded mb-6 overflow-auto max-h-40">
            {error.message}
          </pre>
          <button
            onClick={() => reset()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            다시 시도하기
          </button>
        </div>
      </body>
    </html>
  );
}


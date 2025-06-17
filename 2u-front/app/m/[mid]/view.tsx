"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readContent } from "@/lib/api/message";
import MessageViewer from "@/components/tiptap-custom/viewer";
import { JSONContent } from "@tiptap/react";
import { useMessageAuthStore } from "@/app/_stores/message/auth-store";
import { Eye, EyeOff } from "lucide-react";
import { readMessageDataSchema } from "@/lib/api/schemas/message.schema";

type Props = {
  mid: string;
  messageMeta: {
    id: string;
    createdAt: string;
    updatedAt: string;
    hint?: string;
  };
};

export default function MessageView({ mid, messageMeta }: Props) {
  const password = useMessageAuthStore((state) => state.password);
  const updatePassword = useMessageAuthStore((state) => state.updatePassword);

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<JSONContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialPassword = useRef(password);
  const hasRequested = useRef(false); // Prevents repeated requests

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const result = await readContent(mid, password);
      if (!result.ok) {
        if (result.status === 401) {
          throw new Error("비밀번호가 틀렸습니다.");
        }
        throw new Error("메시지를 가져오는 데 실패했습니다.");
      }
      const data = await result.json();
      const parsedData = readMessageDataSchema.safeParse(data);
      if (!parsedData.success) {
        throw new Error("메시지 데이터 형식이 잘못되었습니다.");
      }
      setMessage(parsedData.data.content);
      setError(null);
    } catch (_err) {
      setError("비밀번호가 틀렸거나 메시지를 가져올 수 없습니다.");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }, [mid, password]);

  // Attempt auto-fetch on mount only if password exists
  useEffect(() => {
    if (!hasRequested.current) {
      hasRequested.current = true;

      if (initialPassword.current && initialPassword.current.length > 0) {
        handleSubmit();
      }
    }
  }, [handleSubmit]);

  if (message) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center">
        <MessageViewer mid={mid} content={message} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">메시지 확인하기</h1>
        <div className="relative flex items-center align-center">
          <input
            type={showPassword ? "text" : "password"}
            className="px-3 py-2 border rounded w-xl"
            placeholder={messageMeta.hint || "비밀번호를 입력하세요"}
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute ml-2 px-2 py-1 bg-transparent right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "확인 중..." : "확인"}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

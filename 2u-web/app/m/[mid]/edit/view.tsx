"use client";

import { useMessageAuthStore } from "@/app/_stores/message/auth-store";
import MessageEditor from "@/components/tiptap-custom/editor";
import { readContent } from "@/lib/api/message";
import { readMessageDataSchema } from "@/lib/api/schemas/message.schema";
import { JSONContent } from "@tiptap/react";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  mid: string;
  messageMeta: {
    id: string;
    createdAt: string;
    updatedAt: string;
    hint?: string | null;
    from?: string | null;
    to?: string | null;
  };
};

export default function MessageEditPageView({ mid, messageMeta }: Props) {
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

      setMessage(parsedData.data.content ?? null);
      setError(null);
    } catch (err) {
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
      <div className="flex min-h-screen bg-gray-100 justify-center pt-20">
        <MessageEditor
          mid={mid}
          initialContent={message}
          initialFrom={messageMeta.from}
          initialTo={messageMeta.to}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">메시지 수정하기</h1>
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
        <div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "확인 중..." : "확인"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

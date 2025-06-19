"use client";

import { useState } from "react";
import PasswordInput from "./password-input";
import { useMessageAuthStore } from "@/app/_stores/message/auth-store";
import { readMessageDataSchema } from "@/lib/api/schemas/message.schema";
import { useMessageStore } from "@/app/_stores/message/message-store";

type PasswordChangeModalProps = {
  mid: string;
  onClose?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

export default function ReadMessageForm({
  mid,
  onClose,
  ref,
}: PasswordChangeModalProps) {
  const password = useMessageAuthStore((state) => state.password);
  const updatePassword = useMessageAuthStore((state) => state.updatePassword);
  const hint = useMessageStore((state) => state.hint);
  const reset = useMessageStore((state) => state.reset);
  const updateMessage = useMessageStore((state) => state.updateMessage);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission for password change
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/message/${mid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("비밀번호가 틀렸습니다.");
        }
        throw new Error("메시지를 가져오는 데 실패했습니다.");
      }

      const data = await response.json();

      const parsedData = readMessageDataSchema.safeParse(data);
      if (!parsedData.success) {
        throw new Error("메시지 데이터 형식이 잘못되었습니다.");
      }

      reset(); // Reset the message store
      updateMessage(parsedData.data); // Update the message store with new data

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-4 min-w-[300px] w-10/12"
      ref={ref}
    >
      <h2 className="text-2xl font-bold text-center">메세지 확인하기</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block mb-1 font-medium">
              비밀번호
            </label>
            <PasswordInput
              id="currentPassword"
              placeholder={hint ?? "비밀번호를 입력하세요"}
              value={password}
              onChangeAction={(value) => updatePassword(value)}
              required
            />
          </div>
        </div>

        <div className="text-center text-sm">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "확인 중..." : "확인"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

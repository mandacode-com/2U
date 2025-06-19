"use client";

import { useState } from "react";
import PasswordInput from "./password-input";

type PasswordChangeModalProps = {
  mid: string;
  onClose?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

export default function PasswordChangeModal({
  mid,
  onClose,
  ref,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newHint, setNewHint] = useState<string | null>(null);
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
      if (newPassword !== confirmPassword) {
        throw new Error("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      }

      const response = await fetch(`/api/message/${mid}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newHint,
        }),
      });

      if (!response.ok) {
        throw new Error("비밀번호 업데이트 실패");
      }

      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewHint(null);
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
      <h2 className="text-2xl font-bold text-center">비밀번호 변경</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block mb-1 font-medium">
              현재 비밀번호
            </label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChangeAction={setCurrentPassword}
              required
              placeholder="현재 비밀번호 입력"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-1 font-medium">
              새 비밀번호
            </label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChangeAction={setNewPassword}
              required
              placeholder="새 비밀번호 입력"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              새 비밀번호 확인
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChangeAction={setConfirmPassword}
              required
              placeholder="비밀번호 다시 입력"
            />
          </div>

          <div>
            <label htmlFor="newHint" className="block mb-1 font-medium">
              새 힌트 (선택)
            </label>
            <input
              type="text"
              id="newHint"
              value={newHint ?? ""}
              onChange={(e) => setNewHint(e.target.value || null)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
              placeholder="비밀번호 힌트 입력 (선택)"
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
            {loading ? "변경 중..." : "비밀번호 변경"}
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

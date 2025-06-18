"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readContent } from "@/lib/api/message";
import MessageViewer from "@/components/tiptap-custom/viewer";
import { JSONContent } from "@tiptap/react";
import { useMessageAuthStore } from "@/app/_stores/message/auth-store";
import { Eye, EyeOff } from "lucide-react";
import { readMessageDataSchema } from "@/lib/api/schemas/message.schema";
import LetterEnvelope from "@/components/message/letter-envelope";
import styles from "./bg-themes.module.css";
import { generateEnvelopeColors } from "@/components/message/generate-envelope-color";

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

  const { letterColor, innerColor, topColor, sidalColor, bottomColor } =
    generateEnvelopeColors("#ffffff", "#fff6ba");

  const [showPassword, setShowPassword] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [animationDone, setAnimationDone] = useState(true);
  const [message, setMessage] = useState<JSONContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialPassword = useRef(password);
  const hasRequested = useRef(false); // Prevents repeated requests

  const handleMessageOpen = useCallback(() => {
    setOpenEnvelope(true);
    setAnimationDone(false);
    setTimeout(() => {
      setAnimationDone(true);
    }, 500); // Match the animation duration
  }, []);

  const handleShowMessage = useCallback(() => {
    setShowMessage(true);
    setAnimationDone(false);
    setTimeout(() => {
      setAnimationDone(true);
    }, 500); // Match the animation duration
  }, []);

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
    } catch (_err) {
      setError("비밀번호가 틀렸거나 메시지를 가져올 수 없습니다.");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }, [mid, password]);

  const handleCloseMessage = useCallback(() => {
    setShowMessage(false);
    setOpenEnvelope(false);
    setAnimationDone(true);
    setMessage(null);
    setError(null);
  }, []);

  // Attempt auto-fetch on mount only if password exists
  useEffect(() => {
    if (!hasRequested.current) {
      hasRequested.current = true;

      if (initialPassword.current && initialPassword.current.length > 0) {
        handleSubmit();
      }
    }
  }, [handleSubmit]);

  return (
    <div
      className={`relative flex items-center justify-center h-full min-h-screen ${styles["polka-dot"]}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !message) {
          handleCloseMessage();
        }
      }}
    >
      {message ? (
        <MessageViewer mid={mid} content={message} />
      ) : (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center w-full px-8">
            <LetterEnvelope
              openEnvelope={openEnvelope}
              handleOpenEnvelope={() => {
                if (animationDone) {
                  handleMessageOpen();
                }
              }}
              showMessage={showMessage}
              handleShowMessage={() => {
                if (animationDone) {
                  handleShowMessage();
                }
              }}
              innerColor={innerColor}
              topColor={topColor}
              sidalColor={sidalColor}
              bottomColor={bottomColor}
              letterColor={letterColor}
            />
          </div>
          {animationDone && showMessage && (
            <div className="absolute max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-4 min-w-[300px] w-10/12">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <h1 className="text-2xl font-bold text-center">
                  메시지 확인하기
                </h1>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="px-3 py-2 border rounded w-full"
                    placeholder={messageMeta.hint || "비밀번호를 입력하세요"}
                    value={password}
                    onChange={(e) => updatePassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute ml-2 px-2 py-1 bg-transparent right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "확인 중..." : "확인"}
                </button>
              </form>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

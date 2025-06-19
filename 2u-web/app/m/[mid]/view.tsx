"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MessageViewer from "@/components/tiptap-custom/viewer";
import { JSONContent } from "@tiptap/react";
import LetterEnvelope from "@/components/envelope/letter-envelope";
import styles from "./bg-themes.module.css";
import { generateEnvelopeColors } from "@/components/envelope/generate-envelope-color";
import PasswordChangeModal from "@/components/forms/password-change-modal";
import ModalContainer from "@/components/modal/modal-container";
import { useMessageStore } from "@/app/_stores/message/message-store";
import ReadMessageForm from "@/components/forms/read-message";

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
  const content = useMessageStore((state) => state.content);

  const { letterColor, innerColor, topColor, sidalColor, bottomColor } =
    generateEnvelopeColors("#ffffff", "#fff6ba");

  const [showPassword, setShowPassword] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [animationDone, setAnimationDone] = useState(true);
  const [message, setMessage] = useState<JSONContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);
  const passwordChangeModalRef = useRef<HTMLDivElement>(null);
  const readMessageFormRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className={`relative flex items-center justify-center h-full min-h-screen ${styles["polka-dot"]}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !content) {
          setOpenEnvelope(false);
          setShowMessage(false);
          setAnimationDone(true);
          setMessage(null);
          setError(null);
        }
      }}
    >
      {content ? (
        <div className="flex flex-col items-center justify-center w-full h-full py-8 gap-4 max-w-3xl">
          <MessageViewer mid={mid} content={content} />
          <div className="flex w-full justify-center sm:justify-end">
            <button
              onClick={() => setPasswordChangeModalOpen(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              비밀번호 변경
            </button>
          </div>
          {passwordChangeModalOpen && (
            <ModalContainer
              open={passwordChangeModalOpen}
              modalRef={passwordChangeModalRef}
            >
              <PasswordChangeModal
                mid={mid}
                onClose={() => setPasswordChangeModalOpen(false)}
                ref={passwordChangeModalRef}
              />
            </ModalContainer>
          )}
        </div>
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
            <ModalContainer open={showMessage} modalRef={readMessageFormRef}>
              <ReadMessageForm
                mid={mid}
                onClose={() => {
                  setShowMessage(false);
                  setOpenEnvelope(false);
                  setAnimationDone(true);
                  setMessage(null);
                  setError(null);
                }}
                ref={readMessageFormRef}
              />
            </ModalContainer>
          )}
        </div>
      )}
    </div>
  );
}

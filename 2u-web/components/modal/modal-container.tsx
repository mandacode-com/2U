"use client";

import { useEffect, useRef, useState } from "react";

export default function ModalContainer({
  children,
  open,
  modalRef,
}: {
  children: React.ReactNode;
  open: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isFixed, setIsFixed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!modalRef.current) return;

    const modalHeight = modalRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (modalHeight > viewportHeight) {
      setIsFixed(false);
      setLoading(false);
    } else {
      setIsFixed(true);
      setLoading(false);
    }
  }, [modalRef]);

  return (
    <div className="absolute w-full h-full">
      {open && (
        <div
          className={`${isFixed ? "fixed" : "absolute"} inset-0 flex items-center justify-center bg-black/50 z-50`}
          style={{
            visibility: loading ? "hidden" : "visible",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

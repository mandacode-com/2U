"use client";

import "@/components/message/letter-envelope.scss";
import Image from "next/image";

type LetterEnvelopeProps = {
  openEnvelope?: boolean;
  handleOpenEnvelope?: () => void;
  showMessage?: boolean;
  handleShowMessage?: () => void;
  className?: string;
  topColor?: string;
  sidalColor?: string;
  bottomColor?: string;
  innerColor?: string;
  letterColor?: string;
};

export default function LetterEnvelope({
  openEnvelope = false,
  handleOpenEnvelope,
  showMessage = false,
  handleShowMessage,
  className = "",
  topColor = "#f0f0f0",
  sidalColor = "#dcdcdc",
  bottomColor = "#c0c0c0",
  innerColor = "#ffffff",
  letterColor = "#ffe596",
}: LetterEnvelopeProps) {
  return (
    <div
      style={{
        ["--top-color" as string]: topColor,
        ["--sidal-color" as string]: sidalColor,
        ["--bottom-color" as string]: bottomColor,
        ["--inner-color" as string]: innerColor,
        ["--letter-color" as string]: letterColor,
      }}
      className={`envelope-container ${className}`}
      onClick={openEnvelope ? handleShowMessage : handleOpenEnvelope}
    >
      <div
        className={`envelope-top-container ${openEnvelope ? "open" : ""}`}
        style={{
          zIndex: 2,
        }}
      >
        <div className={`envelope-top`}></div>
      </div>
      <div
        className="envelope"
        style={{
          zIndex: showMessage ? 20 : 1,
        }}
      >
        <div className="envelope-left"></div>
        <div className="envelope-right"></div>
        <div className="envelope-bottom"></div>
      </div>
      <div
        className={`letter-container ${showMessage ? "show" : ""}`}
        style={{
          zIndex: showMessage ? 10 : 0,
        }}
      >
        <div className="letter"></div>
      </div>
      <Image
        src={"/smile.svg"}
        alt="Smile"
        width={50}
        height={50}
        className={`bg-transparent absolute bottom-0 left-0 z-50 m-2 hover:animate-spin`}
      ></Image>
    </div>
  );
}

"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { Link as TipTapLink } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// --- Toolbar UI ---
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockQuoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";

import { JSONContent } from "@tiptap/core";
import { updateMessage } from "@/lib/api/message";
import { useMessageAuthStore } from "@/app/_stores/message/auth-store";
import Link from "next/link";
import { createImageUploadHandler } from "@/lib/custom-image-upload";
import { MAX_FILE_SIZE } from "@/lib/api/image";
import ImageResize from "tiptap-extension-resize-image";

export default function MessageEditor({
  mid,
  initialContent,
  initialFrom,
  initialTo,
}: {
  mid: string;
  initialContent?: JSONContent;
  initialFrom?: string | null;
  initialTo?: string | null;
}) {
  const password = useMessageAuthStore((state) => state.password);
  const [from, setFrom] = React.useState<string | undefined | null>(
    initialFrom,
  );
  const [to, setTo] = React.useState<string | undefined | null>(initialTo);

  // Initialize editor with all necessary extensions and configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: createImageUploadHandler(mid, password),
        onError: (error) => {
          throw new Error(
            error.message || "이미지 업로드 중 오류가 발생했습니다.",
          );
        },
      }),
      TrailingNode,
      TipTapLink.configure({ openOnClick: false }),
      ImageResize,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        "aria-label": "메인 콘텐츠 영역입니다.",
        class:
          "border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] p-4",
      },
    },
    autofocus: true,
    immediatelyRender: false,
  });

  // Save editor content to backend
  const handleSave = async () => {
    if (!editor) return;
    try {
      const content = editor.getJSON();
      const res = await updateMessage({
        mid,
        content,
        password,
        from: from ?? undefined,
        to: to ?? undefined,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "저장 실패");
      }
      alert("저장되었습니다!");
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pt-20">
      <EditorContext.Provider value={{ editor }}>
        <div className="flex max-w-3xl mx-auto flex-col gap-4">
          <Toolbar className="mb-5">
            <ToolbarGroup>
              <UndoRedoButton action="undo" />
              <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <MarkButton type="bold" />
              <MarkButton type="italic" />
              <MarkButton type="strike" />
              <MarkButton type="underline" />
              <MarkButton type="code" />
              <MarkButton type="superscript" />
              <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <HeadingDropdownMenu levels={[1, 2, 3]} />
              <ListDropdownMenu
                types={["bulletList", "orderedList", "taskList"]}
              />
              <BlockQuoteButton />
              <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <TextAlignButton align="left" />
              <TextAlignButton align="center" />
              <TextAlignButton align="right" />
              <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ColorHighlightPopover />
              <LinkPopover />
              <ImageUploadButton />
            </ToolbarGroup>
          </Toolbar>

          <div className="flex flex-col p-4 gap-4">
            <EditorContent editor={editor} className="prose prose-lg" />
            <div className="flex flex-col">
              <div className="flex flex-row gap-6">
                <div className="flex flex-col w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    작성자
                  </label>
                  <input
                    type="text"
                    value={from ?? ""}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="이름 입력"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    받는 사람
                  </label>
                  <input
                    type="text"
                    value={to ?? ""}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="이름 입력"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  저장하기
                </button>
                <Link
                  href={`/m/${mid}`}
                  className="ml-2 px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  본문보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    </div>
  );
}

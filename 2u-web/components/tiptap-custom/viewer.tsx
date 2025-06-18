import { Content, EditorContent, useEditor } from "@tiptap/react";

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
import ImageResize from "tiptap-extension-resize-image";

type Props = {
  mid: string;
  content: Content;
};

export default function MessageViewer({ mid, content }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      TrailingNode,
      TipTapLink.configure({ openOnClick: false }),
      ImageResize,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "bg-transparent prose prose-lg leading-[1.75]",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="relative mx-auto my-10 max-w-3xl p-10 bg-[#fffdf5] shadow-lg border border-[#e0dccc] rounded-md overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full h-[1px] bg-[#e6e6e6]"
            style={{
              position: "absolute",
              top: `${2.25 * idx}rem`,
              left: 0,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

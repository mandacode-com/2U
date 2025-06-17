import { updateMessage } from "@/lib/api/message";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ mid: string }> },
): Promise<Response> {
  const { mid } = await params;
  const { content, password } = await req.json();
  if (!content) {
    return new Response("새 콘텐츠가 누락되었습니다.", { status: 400 });
  }

  const res = await updateMessage({
    mid,
    content,
    password,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return new Response(error.message || "콘텐츠 저장 실패", {
      status: res.status,
    });
  }

  return new Response("콘텐츠가 성공적으로 업데이트되었습니다.", {
    status: 200,
  });
}

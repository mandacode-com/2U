import { updatePassword } from "@/lib/api/message";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ mid: string }> },
): Promise<Response> {
  const { mid } = await params;
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return new Response("현재 비밀번호 또는 새 비밀번호가 누락되었습니다.", {
      status: 400,
    });
  }

  const response = await updatePassword({
    mid,
    currentPassword,
    newPassword,
  });

  if (!response.ok) {
    return new Response("비밀번호 업데이트 실패", { status: response.status });
  }

  return response;
}

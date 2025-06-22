import { getMessage } from "@/lib/api/message";
import { getMessageDataSchema } from "@/lib/api/schemas/message.schema";
import { API_BASE } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ mid: string }> },
): Promise<Response> {
  const { mid } = await params;

  const response = await getMessage(mid);
  if (!response) {
    return new Response("메시지를 가져오지 못했습니다.", { status: 404 });
  }
  if (!response.ok) {
    return new Response("메시지를 가져오지 못했습니다.", {
      status: response.status,
    });
  }
  const data = await response.json();
  const parsedData = getMessageDataSchema.safeParse(data);
  if (!parsedData.success) {
    return new Response("메시지 데이터 형식이 잘못되었습니다.", {
      status: 500,
    });
  }

  return NextResponse.json(parsedData.data);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ mid: string }> },
): Promise<Response> {
  const { mid } = await params;
  const { password } = await req.json();

  if (!password) {
    return new Response("비밀번호가 누락되었습니다.", { status: 400 });
  }

  const response = await fetch(`${API_BASE}/message/${mid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    return new Response("비밀번호 확인 실패", { status: response.status });
  }

  return response;
}

import { uploadImage } from "@/lib/api/image";
import { API_BASE } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ mid: string }> },
) {
  const { mid } = await params;
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const password = formData.get("password") as string;

  if (!file || !password) {
    return NextResponse.json(
      { error: "file 또는 password 누락" },
      { status: 400 },
    );
  }

  const res = await uploadImage(mid, file, password);

  if (!res.ok) {
    return NextResponse.json({ error: "업로드 실패" }, { status: res.status });
  }

  return NextResponse.json({
    message: "이미지 업로드 성공",
  });
}

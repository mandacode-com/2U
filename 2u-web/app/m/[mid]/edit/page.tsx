import { notFound } from "next/navigation";
import MessageEditPageView from "./view";
import { getMessage } from "@/lib/api/message";
import { getMessageDataSchema } from "@/lib/api/schemas/message.schema";

export default async function Page({
  params,
}: {
  params: Promise<{ mid: string }>;
}) {
  const { mid } = await params;

  if (mid.endsWith(".map")) {
    notFound();
  }

  const messageMeta = await getMessage(mid);

  if (!messageMeta.ok) {
    throw new Error("Failed to fetch message data.");
  }

  const data = await messageMeta.json();
  const parsedData = getMessageDataSchema.safeParse(data);
  if (!parsedData.success || !parsedData.data) {
    throw new Error("Invalid message data format");
  }

  return <MessageEditPageView mid={mid} messageMeta={parsedData.data} />;
}

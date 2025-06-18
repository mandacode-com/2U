import { getMessage } from "@/lib/api/message";
import MessageView from "./view";
import { getMessageDataSchema } from "@/lib/api/schemas/message.schema";

export default async function Page({
  params,
}: {
  params: Promise<{ mid: string }>;
}) {
  const { mid } = await params;

  if (mid.endsWith(".map")) {
    throw new Error("Invalid message ID format");
  }

  const messageMeta = await getMessage(mid);
  if (!messageMeta?.ok) {
    throw new Error("Failed to fetch message data.");
  }

  const data = await messageMeta.json();
  const parsedData = getMessageDataSchema.safeParse(data);
  if (!parsedData.success || !parsedData.data) {
    throw new Error("Invalid message data format");
  }

  return (
    <MessageView
      mid={mid}
      messageMeta={{
        id: parsedData.data.id,
        createdAt: parsedData.data.createdAt,
        updatedAt: parsedData.data.updatedAt,
        hint: parsedData.data.hint ?? undefined,
      }}
    />
  );
}

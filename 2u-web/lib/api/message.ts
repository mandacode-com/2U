import { API_BASE } from "../constants";

/**
 * Fetches a message by its ID.
 * @param mid - The ID of the message to fetch.
 * @return A promise that resolves to the response of the fetch operation.
 */
export async function getMessage(mid: string): Promise<Response> {
  return fetch(`${API_BASE}/message/${mid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Reads the content of a message using its ID and password.
 * @param mid - The ID of the message to read.
 * @param password - The password for the message, if applicable.
 * @return A promise that resolves to the response of the read operation.
 */
export async function readContent(
  mid: string,
  password: string,
): Promise<Response> {
  return fetch(`${API_BASE}/message/${mid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
}

/**
 * Updates the password of a message.
 * @param data - The data to update the password with.
 * @param data.mid - The ID of the message to update.
 * @param data.currentPassword - The current password of the message.
 * @param data.newPassword - The new password for the message.
 * @param data.newHint - The new hint for the message, if applicable.
 * @return A promise that resolves to the response of the update operation.
 */
export async function updatePassword(data: {
  mid: string;
  currentPassword: string;
  newPassword: string;
  newHint?: string;
}): Promise<Response> {
  return fetch(`${API_BASE}/message/${data.mid}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      newHint: data.newHint,
    }),
  });
}

/**
 * Updates the content of a message.
 * @param data - The data to update the message with.
 * @param data.mid - The ID of the message to update.
 * @param data.content - The new content for the message.
 * @param data.password - The password for the message, if applicable.
 * @param data.hint - The new hint for the message, if applicable.
 * @param data.from - The sender of the message, if applicable.
 * @param data.to - The recipient of the message, if applicable.
 * @return A promise that resolves to the response of the update operation.
 */
export async function updateMessage(data: {
  mid: string;
  content: unknown;
  password?: string;
  hint?: string;
  from?: string;
  to?: string;
}): Promise<Response> {
  return fetch(`${API_BASE}/message/${data.mid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: data.content,
      password: data.password,
      hint: data.hint,
      from: data.from,
      to: data.to,
    }),
  });
}

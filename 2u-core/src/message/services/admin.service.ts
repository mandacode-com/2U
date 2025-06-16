import { Injectable, NotFoundException } from '@nestjs/common';
import { CredentialService } from 'src/credential/services/credential.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialService: CredentialService,
  ) {}

  /**
   * Retrieves all messages for a given project ID.
   * @param projectId - The ID of the project to retrieve messages for.
   * @returns An array of messages associated with the project.
   */
  async getMessagesByProjectId(projectId: string) {
    return this.prisma.message.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Creates a new message for a given project ID.
   * @param projectId - The ID of the project to create the message for.
   * @param content - The content of the message.
   * @param messageId - Optional ID for the message.
   * @param initialPassword - Optional initial password for the message.
   * @param hint - Optional hint for the password.
   * @returns The created message object.
   */
  async createMessage(
    projectId: string,
    content?: Prisma.InputJsonValue,
    messageId?: string,
    initialPassword?: string,
    hint?: string,
  ) {
    let hashedPassword: string | undefined = undefined;
    if (initialPassword) {
      hashedPassword =
        await this.credentialService.hashPassword(initialPassword);
    }
    return this.prisma.message.create({
      data: {
        id: messageId,
        projectId,
        content: content ?? Prisma.JsonNull,
        password: hashedPassword,
        hint: hint,
      },
    });
  }

  /**
   * Updates an existing message by its ID.
   * @param messageId - The ID of the message to update.
   * @param content - Optional new content for the message.
   * @param password - Optional new password for the message.
   * @param hint - Optional new hint for the password.
   * @returns The updated message object.
   */
  async updateMessage(
    messageId: string,
    content?: Prisma.InputJsonValue,
    password?: string,
    hint?: string,
  ) {
    let hashedPassword: string | undefined = undefined;
    if (password) {
      hashedPassword = await this.credentialService.hashPassword(password);
    }
    const existingMessage = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content: content ?? existingMessage.content ?? Prisma.JsonNull,
        password: hashedPassword || existingMessage.password,
        hint: hint ?? existingMessage.hint,
      },
    });
  }

  /**
   * Deletes a message by its ID.
   * @param messageId - The ID of the message to delete.
   */
  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  /**
   * Deletes all messages associated with a given project ID.
   * @param projectId - The ID of the project whose messages should be deleted.
   */
  async deleteMessagesByProjectId(projectId: string) {
    return this.prisma.message.deleteMany({
      where: { projectId },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CredentialService } from 'src/credential/services/credential.service';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class MessageUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialService: CredentialService,
  ) {}

  /**
   * Retrieves message information by its ID.
   * @param messageId - The ID of the message to retrieve.
   * @returns The message information including id, createdAt, updatedAt, and hint.
   */
  async getMessageInfo(messageId: string) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          hint: true,
        },
      });
      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }

      return message;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Reads a message by its ID, optionally checking for a password.
   * @param messageId - The ID of the message to read.
   * @param password - Optional password to access the message.
   * @returns The message content and metadata if accessible.
   */
  async readMessage(messageId: string, password?: string) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }
      if (message.password) {
        if (!password) {
          throw new UnauthorizedException(
            'This message is password protected. Please provide a password.',
          );
        }
        const isValidPassword = await this.credentialService.comparePasswords(
          password,
          message.password,
        );
        if (!isValidPassword) {
          throw new UnauthorizedException(
            'Invalid password. Please try again.',
          );
        }
      }

      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Update the password for a message.
   * @param messageId - The ID of the message to check.
   * @param currentPassword - The current password of the message.
   * @param newPassword - The new password to set for the message.
   * @param newHint - Optional new hint for the password.
   */
  async updatePassword(
    messageId: string,
    currentPassword: string,
    newPassword: string,
    newHint?: string,
  ) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }
      if (!message.password) {
        throw new UnauthorizedException(
          'This message does not have a password set.',
        );
      }
      const isValidPassword = await this.credentialService.comparePasswords(
        currentPassword,
        message.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid current password.');
      }

      const hashedNewPassword =
        await this.credentialService.hashPassword(newPassword);

      await this.prisma.message.update({
        where: { id: messageId },
        data: { password: hashedNewPassword, hint: newHint },
      });
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * @description Updates the content of a message by its ID.
   * @param messageId - The ID of the message to update.
   * @param password - Optional password to access the message.
   * @param content - The new content for the message.
   * @returns The updated message object.
   */
  async updateContent(
    messageId: string,
    password: string | undefined,
    content: Prisma.InputJsonValue,
  ) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }
      if (message.password) {
        if (!password) {
          throw new UnauthorizedException(
            'This message is password protected. Please provide a password.',
          );
        }
        const isValidPassword = await this.credentialService.comparePasswords(
          password,
          message.password,
        );
        if (!isValidPassword) {
          throw new UnauthorizedException(
            'Invalid password. Please try again.',
          );
        }
      }

      return this.prisma.message.update({
        where: { id: messageId },
        data: { content: content ?? Prisma.JsonNull },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Verifies the password for a message.
   * @param messageId - The ID of the message to verify.
   * @param password - The password to verify against the message.
   * @returns True if the password matches, false otherwise.
   */
  async verifyMessagePassword(
    messageId: string,
    password?: string,
  ): Promise<boolean> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }
      if (!message.password) {
        return true; // No password set, access granted
      }
      if (!password) {
        throw new UnauthorizedException(
          'This message is password protected. Please provide a password.',
        );
      }
      return this.credentialService.comparePasswords(
        password,
        message.password,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
      }
      throw error; // Re-throw other errors
    }
  }
}

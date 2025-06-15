import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
   */
  async updatePassword(
    messageId: string,
    currentPassword: string,
    newPassword: string,
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
        data: { password: hashedNewPassword },
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
}

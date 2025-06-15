import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessagesByProjectId(projectId: string) {
    return this.prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getMessageById(messageId: string) {
    return this.prisma.message.findUnique({
      where: { id: messageId },
    });
  }

  async createMessage(projectId: string, content?: string, messageId?: string) {
    return this.prisma.message.create({
      data: {
        id: messageId,
        projectId,
        content: content || '',
      },
    });
  }

  async updateMessage(messageId: string, content: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
  }

  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  async deleteMessagesByProjectId(projectId: string) {
    return this.prisma.message.deleteMany({
      where: { projectId },
    });
  }
}

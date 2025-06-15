import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ProjectGuard } from 'src/common/guards/project.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';
import {
  CreateMessageBody,
  createMessageBodySchema,
  UpdateMessageBody,
  updateMessageBodySchema,
} from '../schemas/message.schema';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('list/:projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async getMessagesByProjectId(@Param('projectId') projectId: string) {
    return this.messageService.getMessagesByProjectId(projectId);
  }

  @Get(':messageId')
  async getMessageById(@Param('messageId') messageId: string) {
    return this.messageService.getMessageById(messageId);
  }

  @Post('create/:projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async createMessage(
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(createMessageBodySchema))
    body: CreateMessageBody,
  ) {
    return this.messageService.createMessage(
      projectId,
      body.content,
      body.messageId,
    );
  }

  @Patch('update/:messageId')
  @UseGuards(AuthGuard, ProjectGuard)
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body(new ZodValidationPipe(updateMessageBodySchema))
    body: UpdateMessageBody,
  ) {
    return this.messageService.updateMessage(messageId, body.content);
  }

  @Delete(':projectId/:messageId')
  @UseGuards(AuthGuard, ProjectGuard)
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.messageService.deleteMessage(messageId);
  }

  @Delete('delete-by-project/:projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async deleteMessagesByProjectId(@Param('projectId') projectId: string) {
    return this.messageService.deleteMessagesByProjectId(projectId);
  }
}

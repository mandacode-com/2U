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
import { ProjectGuard } from 'src/common/guards/project.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';
import {
  CreateMessageBody,
  createMessageBodySchema,
  UpdateMessageBody,
  updateMessageBodySchema,
} from '../schemas/admin.schema';
import { MessageAdminService } from '../services/admin.service';

@Controller('admin/message')
export class MessageAdminController {
  constructor(private readonly adminService: MessageAdminService) {}

  @Get('list/:projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async getMessagesByProjectId(@Param('projectId') projectId: string) {
    return this.adminService.getMessagesByProjectId(projectId);
  }

  @Post(':projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async createMessage(
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(createMessageBodySchema))
    body: CreateMessageBody,
  ) {
    return this.adminService.createMessage(
      projectId,
      body.content,
      body.messageId,
      body.initialPassword,
    );
  }

  @Patch(':messageId')
  @UseGuards(AuthGuard, ProjectGuard)
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body(new ZodValidationPipe(updateMessageBodySchema))
    body: UpdateMessageBody,
  ) {
    return this.adminService.updateMessage(
      messageId,
      body.content,
      body.password,
    );
  }

  @Delete(':projectId/:messageId')
  @UseGuards(AuthGuard, ProjectGuard)
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.adminService.deleteMessage(messageId);
  }

  @Delete(':projectId')
  @UseGuards(AuthGuard, ProjectGuard)
  async deleteMessagesByProjectId(@Param('projectId') projectId: string) {
    return this.adminService.deleteMessagesByProjectId(projectId);
  }
}

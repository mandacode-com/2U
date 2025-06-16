import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';
import {
  ReadMessageBody,
  readMessageBodySchema,
  UpdateContentBody,
  updateContentBodySchema,
  UpdatePasswordBody,
  updatePasswordBodySchema,
} from '../schemas/user.schema';
import { MessageUserService } from '../services/user.service';

@Controller('message')
export class MessageUserController {
  constructor(private readonly readService: MessageUserService) {}

  @Get(':messageId')
  async getMessageInfo(@Param('messageId') messageId: string) {
    return this.readService.getMessageInfo(messageId);
  }

  @Post(':messageId')
  async readMessage(
    @Param('messageId') messageId: string,
    @Body(new ZodValidationPipe(readMessageBodySchema)) body: ReadMessageBody,
  ) {
    return this.readService.readMessage(messageId, body.password);
  }

  @Patch(':messageId/password')
  async updateMessagePassword(
    @Param('messageId') messageId: string,
    @Body(new ZodValidationPipe(updatePasswordBodySchema))
    body: UpdatePasswordBody,
  ) {
    return this.readService.updatePassword(
      messageId,
      body.currentPassword,
      body.newPassword,
      body.newHint,
    );
  }

  @Patch(':messageId/content')
  async updateMessageContent(
    @Param('messageId') messageId: string,
    @Body(new ZodValidationPipe(updateContentBodySchema))
    body: UpdateContentBody,
  ) {
    return this.readService.updateContent(
      messageId,
      body.password,
      body.newContent,
    );
  }
}

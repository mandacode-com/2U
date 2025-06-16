import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';
import {
  ReadMessageBody,
  readMessageBodySchema,
  UpdateContentBody,
  updateContentBodySchema,
  UpdatePasswordBody,
  updatePasswordBodySchema,
  UploadImageBody,
  uploadImageBodySchema,
} from '../schemas/user.schema';
import { MessageUserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/services/storage.service';
import { Response } from 'express';
import { messageStorageName } from 'src/common/storage_path';

@Controller('message')
export class MessageUserController {
  constructor(
    private readonly readService: MessageUserService,
    private readonly storageService: StorageService,
  ) {}

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

  @Get(':messageId/image')
  getMessageImage(@Param('messageId') messageId: string, @Res() res: Response) {
    const stream = this.storageService.downloadFile(
      messageStorageName,
      messageId,
    );

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${messageId}"`);

    stream.pipe(res);
  }

  @Post(':messageId/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('messageId') messageId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(uploadImageBodySchema)) body: UploadImageBody,
  ) {
    const verifyResult = await this.readService.verifyMessagePassword(
      messageId,
      body.password,
    );
    if (!verifyResult) {
      throw new UnauthorizedException(
        'This message is password protected. Please provide a valid password.',
      );
    }

    return this.storageService.uploadFile(file, messageStorageName, messageId);
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/modules/prisma.module';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';

@Module({
  imports: [PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

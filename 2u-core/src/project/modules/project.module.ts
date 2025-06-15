import { Module } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { ProjectController } from '../controllers/project.controller';
import { PrismaModule } from 'src/prisma/modules/prisma.module';
import { MessageModule } from 'src/message/modules/message.module';

@Module({
  imports: [PrismaModule, MessageModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

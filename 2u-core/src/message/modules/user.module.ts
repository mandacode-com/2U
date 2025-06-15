import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/modules/prisma.module';
import { MessageUserController } from '../controllers/user.controller';
import { MessageUserService } from '../services/user.service';
import { CredentialModule } from 'src/credential/modules/credential.module';

@Module({
  imports: [PrismaModule, CredentialModule],
  controllers: [MessageUserController],
  providers: [MessageUserService],
  exports: [MessageUserService],
})
export class MessageUserModule {}

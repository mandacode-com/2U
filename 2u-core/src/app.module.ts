import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProjectModule } from './project/modules/project.module';
import { MessageModule } from './message/modules/message.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from './common/schemas/config.schema';
import { validate } from './common/config/validate';
import { ProjectCheckModule } from './project/modules/check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Config, true>) => ({
        secret: config.get<Config['auth']>('auth').gatewayJwtSecret,
        global: true,
      }),
      global: true,
    }),
    ProjectModule,
    MessageModule,
    ProjectCheckModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/core/database/prisma.module';
import { SmsService } from 'src/common/services/sms.service';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [VerificationController],
  providers: [VerificationService, SmsService],
})
export class VerificationModule {}

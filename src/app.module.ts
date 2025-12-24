import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

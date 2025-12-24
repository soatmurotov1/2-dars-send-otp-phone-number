import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { sendOtpDto } from './dto/verification.dto';

@Controller('verification')
export class VerificationController {
    constructor( private readonly verificationService: VerificationService) {}

    @Post("send")
    sendOtp(@Body() body: sendOtpDto) {
        return  this.verificationService.sendOtp(body)
    }
}
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { sendOtpDto } from './dto/verification.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { generateOtp } from 'src/core/utils/random';
import { SmsService } from 'src/common/services/sms.service';
import { EVerificationTypes } from 'src/common/types/verification.types';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private smsService: SmsService
  ) {}

  public getKey(
    type: EVerificationTypes,
    phone: string,
    confirmation?: boolean
  ) {
    const storeKeys: Record<EVerificationTypes, string> = {
      [EVerificationTypes.REGISTER]: 'reg_',
      [EVerificationTypes.RESET_PASSWORD]: 'respass_',
      [EVerificationTypes.EDIT_PHONE]: 'edph_'
    }
    let key = storeKeys[type]
    if (confirmation) {
      key += "cfm_"
    }
    key += phone
    return key
  }

  private async throwIfUserExits(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: phone
      }
    })
    if (user) {
      throw new HttpException(
        "Phone already used",
         HttpStatus.BAD_REQUEST
        )
    }
    return user
  }

  private getMessage(type: EVerificationTypes, otp: string) {
        switch (type) {

            case EVerificationTypes.REGISTER:
                return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`
            case EVerificationTypes.RESET_PASSWORD:
                return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`
            case EVerificationTypes.EDIT_PHONE:
                return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`
        }
    }

  async sendOtp(payload: sendOtpDto) {
    const { type, phone } = payload
    const key = this.getKey(type, phone)
    const session = await this.redis.get(key)

    if (session) {
      throw new HttpException(
        "Code already send to user",
        HttpStatus.BAD_REQUEST
      )
    }

    switch (type) {
      case EVerificationTypes.REGISTER:
        await this.throwIfUserExits(phone)
        break
      case EVerificationTypes.RESET_PASSWORD:
        await this.throwIfUserExits(phone)
        break
      case EVerificationTypes.EDIT_PHONE:
        await this.throwIfUserExits(phone)
        break
    }
    const otp = generateOtp()
    await this.redis.set(key, JSON.stringify(otp), 600)
    await this.smsService.sendSMS(this.getMessage(type, otp), phone)
    return { message: "Confirmation OTP code send" }
  }
}
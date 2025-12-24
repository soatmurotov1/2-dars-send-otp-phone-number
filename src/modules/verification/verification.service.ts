import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { sendOtpDto } from './dto/verification.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { EvirificationTypes } from 'src/common/types/verification';
import { generateOtp } from 'src/core/utils/random';

@Injectable()
export class VerificationService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService
    ) {}

    public getKey (
        type: EvirificationTypes,
        phone: string,
        confirmation?: boolean
    ) {
        const storeKeys: Record<EvirificationTypes, string> = {
            [EvirificationTypes.REGISTER]: "reg_",
            [EvirificationTypes.RESET_PASSWORD]: "respass_",
            [EvirificationTypes.EDIT_PHONE]: "edph_"
        }
        let key = storeKeys[type]
        if(confirmation) {
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
        if(user) {
            throw new HttpException("Phone already used", HttpStatus.BAD_REQUEST)
        }
        return user
    }


    private getMessage(type: EvirificationTypes, otp: string) {
        switch (type) {
            case EvirificationTypes.REGISTER:
                return `Tastiqlash kodi ${otp}`
            case EvirificationTypes.RESET_PASSWORD:
                return `Parolni qayta tilash kodi ${otp}`
            case EvirificationTypes.EDIT_PHONE:
                return `Telefonni o'zgartirish kodi ${otp}`
        }
    }

    async sendOtp(payload: sendOtpDto) {
            const { type    , phone } = payload
            const key = this.
            const session = await this.redis.get(key)

            if(session) {
                throw new HttpException(
                    "Code already send to user",
                    HttpStatus.BAD_REQUEST
                )
            }

            switch (type) {
                case EvirificationTypes.REGISTER:
                    await this.throwIfUserExits(phone)
                    break
                case EvirificationTypes.RESET_PASSWORD:
                    await this.throwIfUserExits(phone)
                    break
                case EvirificationTypes.EDIT_PHONE:
                    await this.throwIfUserExits(phone)
                    break
            }
            const otp = generateOtp()
            await this.redis.set(key, JSON.stringify(otp), 600)
            await this.smsService.sendSMS(this.getMessage(type, otp), phone)
            return { message: "Confirmation code send "}
    }
}

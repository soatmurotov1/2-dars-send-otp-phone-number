import { IsEnum, IsMobilePhone, IsString } from 'class-validator';
import { EVerificationTypes } from 'src/common/types/verification.types';

export class sendOtpDto {
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes

  @IsMobilePhone("uz-UZ")
  @IsString()
  phone: string
}
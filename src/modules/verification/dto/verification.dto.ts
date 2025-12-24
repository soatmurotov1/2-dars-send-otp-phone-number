import { IsEnum, IsMobilePhone, IsString } from "class-validator";
import { EvirificationTypes } from "src/common/types/verification";


export class sendOtpDto {
    @IsEnum(EvirificationTypes)
    type: EvirificationTypes

    @IsMobilePhone("uz-UZ")

    @IsString()
    phone: string
}
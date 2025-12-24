export enum EvirificationTypes {
    REGISTER = "register",
    RESET_PASSWORD = "reset_password",
    EDIT_PHONE = "edit_phone"

}

export interface IvhechOtp {
    type: EvirificationTypes
    phone: string
    otp: string
}
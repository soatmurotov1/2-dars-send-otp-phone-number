

export enum EVerificationTypes {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
  EDIT_PHONE = 'edit_phone',
}

export interface ICheckOtp {
  type: EVerificationTypes
  phone: string
  otp: string
}
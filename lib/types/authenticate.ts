export enum AuthenticateSectionEnum {
  CHECK = "CHECK",
  PASSWORD = "PASSWORD",
  OTP = "OTP",
}

export enum VerificationOTPUsageEnum {
  AUTHENTICATE = "AUTHENTICATE",
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY = "VERIFY",
}

export interface AuthenticateTokensType {
  access: string;
  refresh: string;
  access_exp: number;
}

export interface UserDetailType {
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_code: string;
  has_password: boolean;
}

export interface AuthenticateCheckResultType {
  section: AuthenticateSectionEnum;
}

// ForgotPassword
export interface ForgotPasswordTokenType {
  token: string;
}

export enum ForgotPasswordSectionEnum {
  CHECK = "CHECK",
  OTP = "OTP",
  RESET = "RESET",
}

export interface ForgotPasswordResetDataType {
  current_password: string;
  password: string;
  confirm_password: string;
}

export interface ForgotPasswordResetResultType {
  error_input_name?: string;
  access?: string;
  refresh?: string;
  access_exp?: number;
}

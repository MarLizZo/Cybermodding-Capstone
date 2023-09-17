export interface IPasswordChange {
  id: number | undefined;
  username: string | undefined;
  actual: string;
  repeatActual: string;
  newPassword: string;
  repeatNewPassword: string;
}

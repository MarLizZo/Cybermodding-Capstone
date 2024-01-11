export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  description: string;
  avatar: File | null;
  birthdate: Date;
}

import { UserLevel } from '../enums/user-level';

export interface IQuoteInfo {
  content: string;
  username: string;
  user_id: number;
  user_level?: UserLevel | string;
}

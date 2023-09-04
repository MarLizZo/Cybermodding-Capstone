import { UserLevel } from '../enums/user-level';

export interface IChatMessage {
  id?: number;
  username: string | undefined;
  content: string;
  date?: Date;
  level: UserLevel | undefined | string;
}

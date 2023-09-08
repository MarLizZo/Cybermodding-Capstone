import { UserLevel } from '../enums/user-level';
import { IUserData } from './iuser-data';

export interface ICommentData {
  id?: number;
  content: string;
  user: IUserData;
  publishedDate: Date;
  user_level?: UserLevel;
}

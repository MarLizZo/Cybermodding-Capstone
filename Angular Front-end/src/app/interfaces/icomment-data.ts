import { UserLevel } from '../enums/user-level';
import { IPostData } from './ipost-data';
import { IUserData } from './iuser-data';

export interface ICommentData {
  id?: number;
  content: string;
  user: IUserData;
  publishedDate: Date;
  user_level?: UserLevel;
  post?: IPostData;
}

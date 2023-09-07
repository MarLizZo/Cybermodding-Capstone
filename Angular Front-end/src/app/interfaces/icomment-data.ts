import { IPostData } from './ipost-data';
import { IUserData } from './iuser-data';

export interface ICommentData {
  id?: number;
  content: string;
  user: IUserData;
  post: IPostData;
  publishedDate: Date;
}

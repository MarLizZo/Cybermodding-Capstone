import { UserLevel } from '../enums/user-level';
import { ICommentData } from './icomment-data';
import { IPostData } from './ipost-data';

export interface IUserData {
  id?: number;
  username: string;
  email: string;
  description: string;
  registrationDate: Date;
  avatar: string | null;
  birthdate: Date;
  posts_count?: number;
  comments_count?: number;
  last_post?: IPostData | null;
  last_comment?: ICommentData | null;
  level?: UserLevel | string;
  roles?: [
    {
      id: number;
      roleName: string;
    }
  ];
}

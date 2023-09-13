import { PostType } from '../enums/post-type';
import { UserLevel } from '../enums/user-level';
import { ICommentData } from './icomment-data';
import { Ireaction } from './ireaction';
import { ISubSectionData } from './isub-section-data';
import { IUserData } from './iuser-data';

export interface IPostData {
  id?: number;
  title: string;
  body: string;
  publishedDate: Date;
  type: PostType;
  author: IUserData;
  user_level?: UserLevel;
  sub_section: ISubSectionData;
  reactions: Ireaction[];
  comments: ICommentData[];
  main_section_title?: string;
  main_section_id?: number;
  subsection_title?: string;
  subsection_id?: number;
  comments_count?: number;
  last_comment?: ICommentData;
}

import { SafeHtml } from '@angular/platform-browser';
import { PostType } from '../enums/post-type';
import { UserLevel } from '../enums/user-level';
import { ICommentData } from './icomment-data';
import { Ireaction } from './ireaction';
import { IResponseBase } from './iresponse-base';
import { ISubSectionData } from './isub-section-data';
import { IUserData } from './iuser-data';

export interface IPostData {
  response?: IResponseBase;
  id?: number;
  title: string;
  body: string | SafeHtml;
  publishedDate: Date;
  type: PostType;
  author: IUserData;
  user_level?: UserLevel | string;
  sub_section: ISubSectionData;
  reactions: Ireaction[];
  comments: ICommentData[];
  main_section_title?: string;
  main_section_id?: number;
  subsection_title?: string;
  subsection_id?: number;
  comments_count?: number;
  reactions_count?: number;
  user_id?: number;
  user_name?: string;
  last_comment?: ICommentData;
}

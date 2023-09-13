import { PostType } from '../enums/post-type';
import { UserLevel } from '../enums/user-level';
import { ICommentPageable } from './icommentpageable';
import { Ireaction } from './ireaction';
import { ISubSectionData } from './isub-section-data';
import { IUserData } from './iuser-data';

export interface IPostDataPaged {
  id: number;
  title: string;
  body: string;
  publishedDate: Date;
  type: PostType;
  author: IUserData;
  user_level?: UserLevel;
  sub_section: ISubSectionData;
  reactions: Ireaction[];
  comments: ICommentPageable;
  main_section_title?: string;
  main_section_id?: number;
  subsection_title?: string;
  subsection_id?: number;
}

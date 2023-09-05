import { PostType } from '../enums/post-type';
import { ISubSectionData } from './isub-section-data';
import { IUserData } from './iuser-data';

export interface IPostData {
  id?: number;
  title: string;
  body: string;
  publishedDate: Date;
  type: PostType;
  author: IUserData;
  sub_section: ISubSectionData;
}

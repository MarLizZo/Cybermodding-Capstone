import { ISubSectionData } from './isub-section-data';
import { IUserData } from './iuser-data';

export interface IPostData {
  id?: number;
  title: string;
  body: string;
  publishedDate: Date;
  author: IUserData;
  sub_section: ISubSectionData;
}

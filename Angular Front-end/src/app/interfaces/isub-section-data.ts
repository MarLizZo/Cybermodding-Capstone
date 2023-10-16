import { IPostData } from './ipost-data';
import { IResponseBase } from './iresponse-base';

export interface ISubSectionData {
  response?: IResponseBase;
  id?: number;
  title: string;
  description: string;
  active: boolean;
  order_number: number;
  posts: IPostData[];
  parent_id: number;
  parent_section_id?: number;
  parent_title: string;
}

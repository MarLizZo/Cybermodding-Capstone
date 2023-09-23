import { IPostData } from './ipost-data';

export interface ISubSectionData {
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

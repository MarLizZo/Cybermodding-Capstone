import { IPostData } from './ipost-data';

export interface IPostHomePaged {
  content: IPostData[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

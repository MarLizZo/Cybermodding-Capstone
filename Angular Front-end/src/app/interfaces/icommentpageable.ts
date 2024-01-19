import { ICommentData } from './icomment-data';

export interface ICommentPageable {
  content: ICommentData[];
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

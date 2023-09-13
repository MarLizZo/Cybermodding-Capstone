import { ICommentData } from './icomment-data';

export interface ICommentPageable {
  content: ICommentData[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
  };
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

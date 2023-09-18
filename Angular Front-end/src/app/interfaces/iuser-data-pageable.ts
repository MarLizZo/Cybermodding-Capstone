import { IUserData } from './iuser-data';

export interface IUserDataPageable {
  content: IUserData[];
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

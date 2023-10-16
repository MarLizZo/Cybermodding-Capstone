import { IResponseBase } from './iresponse-base';
import { IUserData } from './iuser-data';

export interface IBosses {
  response: IResponseBase | undefined;
  admins: IUserData[];
  mods: IUserData[];
}

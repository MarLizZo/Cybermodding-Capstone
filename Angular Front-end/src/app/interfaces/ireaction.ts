import { ReactionType } from '../enums/reaction-type';
import { IResponseBase } from './iresponse-base';
import { IUserData } from './iuser-data';

export interface Ireaction {
  response?: IResponseBase;
  id?: number;
  user?: IUserData;
  user_id: number;
  post_id: number;
  type: ReactionType | string;
}

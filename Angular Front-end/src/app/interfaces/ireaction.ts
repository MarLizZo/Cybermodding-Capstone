import { ReactionType } from '../enums/reaction-type';
import { IUserData } from './iuser-data';

export interface Ireaction {
  id?: number;
  user?: IUserData;
  user_id: number;
  post_id: number;
  type: ReactionType | string;
}

import { ReactionType } from '../enums/reaction-type';
import { IUserData } from './iuser-data';

export interface Ireaction {
  user?: IUserData;
  user_id: number;
  post_id: number;
  type: ReactionType | string;
}

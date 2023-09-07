import { ReactionType } from '../enums/reaction-type';
import { IUserData } from './iuser-data';

export interface Ireaction {
  id?: number;
  user: IUserData;
  type: ReactionType;
}

import { IUserData } from './iuser-data';

export interface IContactMessageBody {
  id: number;
  fromUser: IUserData;
  content: string;
  date: Date;
  closed: boolean;
  type: string;
}

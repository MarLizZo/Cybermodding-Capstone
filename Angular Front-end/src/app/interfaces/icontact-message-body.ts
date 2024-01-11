import { IUserData } from './iuser-data';

export interface IContactMessageBody {
  id: number;
  fromUser?: IUserData;
  name?: string;
  content: string;
  title: string;
  date: Date;
  closed: boolean;
  type: string;
}

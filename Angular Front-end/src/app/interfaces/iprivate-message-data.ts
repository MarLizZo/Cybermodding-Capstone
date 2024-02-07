import { IUserData } from './iuser-data';

export interface IPrivateMessageData {
  id: number;
  title: string;
  content: string;
  sender_user: IUserData;
  recipient_user: IUserData;
  date: Date;
  viewed: boolean;
}

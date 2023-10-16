import { IResponseBase } from './iresponse-base';
import { IUserData } from './iuser-data';

export interface IPrivateMessageData {
  response?: IResponseBase;
  id?: number;
  title: string;
  content: string;
  sender_user?: IUserData;
  recipient_user?: IUserData;
  date?: Date;
  viewed?: boolean;
}

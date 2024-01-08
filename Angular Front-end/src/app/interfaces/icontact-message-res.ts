import { IContactMessageBody } from './icontact-message-body';
import { IResponseBase } from './iresponse-base';

export interface IContactMessage {
  response: IResponseBase;
  container: IContactMessageBody;
}

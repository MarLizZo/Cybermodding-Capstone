import { SafeHtml } from '@angular/platform-browser';
import { UserLevel } from '../enums/user-level';

export interface IChatMessage {
  id?: number;
  username: string | undefined;
  user_id: number | undefined;
  content: string | SafeHtml;
  date?: Date;
  level: UserLevel | undefined | string;
}

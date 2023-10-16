import { SideBlockType } from '../enums/side-block-type';
import { IResponseBase } from './iresponse-base';

export interface ISideBlockData {
  response?: IResponseBase;
  id?: number;
  title: string;
  content: string;
  active: boolean;
  e_block_type: SideBlockType | string;
  order_number: number;
}

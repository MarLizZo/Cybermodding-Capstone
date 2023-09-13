import { SideBlockType } from '../enums/side-block-type';

export interface ISideBlockData {
  id?: number;
  title: string;
  content: string;
  active: boolean;
  e_block_type: SideBlockType | string;
  order_number: number;
}

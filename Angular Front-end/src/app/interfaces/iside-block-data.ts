import { SideBlockType } from '../enums/side-block-type';

export interface ISideBlockData {
  id?: number;
  title: string;
  content: string;
  active: boolean;
  e_block_type: SideBlockType;
  order_number: number;
}

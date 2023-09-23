import { ISubSectionData } from './isub-section-data';

export interface ISectionData {
  id?: number;
  title: string;
  description: string;
  active: boolean;
  order_number: number;
  sub_sections?: ISubSectionData[];
}

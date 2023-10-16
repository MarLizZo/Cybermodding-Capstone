import { IResponseBase } from './iresponse-base';
import { ISubSectionData } from './isub-section-data';

export interface ISectionData {
  response?: IResponseBase;
  id?: number;
  title: string;
  description: string;
  active: boolean;
  order_number: number;
  sub_sections?: ISubSectionData[];
}

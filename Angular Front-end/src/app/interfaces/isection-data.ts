import { SectionCategory } from '../enums/section-category';

export interface ISectionData {
  id?: number;
  title: string;
  description: string;
  active: boolean;
  category: SectionCategory;
  order_number: number;
}

import { PostType } from '../enums/post-type';

export interface IPostDTO {
  id?: number;
  title: string;
  body: string;
  user_id: number;
  active?: boolean;
  subSection_id?: number;
  type: PostType | string;
}

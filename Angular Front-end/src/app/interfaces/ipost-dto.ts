import { PostType } from '../enums/post-type';

export interface IPostDTO {
  title: string;
  body: string;
  user_id: number;
  subSection_id: number;
  type: PostType | string;
}

import { ICommentPageable } from './icommentpageable';
import { IPostHomePaged } from './ipost-home-paged';
import { IUserDataPageable } from './iuser-data-pageable';

export interface Isearchres {
  users: IUserDataPageable;
  posts: IPostHomePaged;
  comments: ICommentPageable;
}

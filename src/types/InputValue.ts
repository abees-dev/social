import { Maybe } from '.';
import { Post, User, UserProfile } from './Base';

export interface LoginValues {
  email: string;
  password: string;
}

export type RegisterValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password?: string;
};

export type QueryInput = {
  limit?: Maybe<number>;
  page?: Maybe<number>;
  skip?: Maybe<number>;
  take?: Maybe<number>;
  position?: Maybe<number>;
  order?: 'asc' | 'desc' | 'ascending' | 'descending';
  comment_id?: string;
};

export type MaskAsReadInput = {
  type: 'single' | 'multiple';
  notificationId?: string;
  ownerId: string;
};

export type CreateCommentInput = {
  authorId: string;
  message: string;
  postId: string;
};

export type ReplyCommentInput = {
  author: User;
  message: string;
  commentId: string;
  postId: string;
};

export type PostInput = {
  content: string;
  caption: string;
  status: number;
  location: string;
  view: number;
  medias?: string[];
  tag?: string[];
  feeling_id?: string;
};

export type FriendQueryInput = {
  query?: QueryInput;
  userId: string;
};

export type AddFriendInput = {
  requester: User;
  addressee: User;
  type?: 'accepted' | 'requested';
};

export type LikePostInput = {
  user: User;
  post: Post;
  type: string;
};

export type UnLikePostInput = {
  userId: string;
  postId: string;
};

export interface ProfileInput extends Partial<UserProfile> {
  firstName: string;
  lastName: string;
}

export interface SendChatInput {
  message: string;
  sender: User;
  conversationId: string;
  receiveId: Array<string>;
}

export interface CreateConversationInput {
  senderId: string;
  receiverId: Array<string>;
}

// export type AcceptFriendInput = {
//   id: string;
//   addressee: User;
//   type?: string;
// };

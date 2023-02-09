import { Maybe } from '.';

export type Model = {
  __typename?: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
};
export interface FileType extends File {
  preview?: string;
}

export type User = {
  __typename?: 'User';
  avatar?: Maybe<string>;
  comment?: Maybe<Comment>;
  createdAt: Date;
  email: Maybe<string>;
  firstName: Maybe<string>;
  githubId?: Maybe<string>;
  googleId?: Maybe<string>;
  id: string;
  lastName: Maybe<string>;
  postLike: Array<PostLike>;
  posts: Array<Post>;
  profile?: Maybe<UserProfile>;
  provider?: Maybe<string>;
  updatedAt: Date;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  dayOfBirth: Date;
  district: string;
  gender: string;
  id: string;
  liveAt: string;
  phoneNumber: string;
  province: string;
  story: string;
  thumbnail: string;
  user: User;
  ward: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  __typename?: 'Post';
  caption: string;
  checking: string;
  comment: Array<Comment>;
  content: string;
  createdAt: Date;
  id: string;
  image: Array<Image>;
  like?: Maybe<Array<PostLike>>;
  status: string;
  updatedAt: Date;
  user: User;
  visible: string;
};

export type PostLike = {
  __typename?: 'PostLike';
  createdAt: Date;
  id: string;
  post: User;
  type: string;
  updatedAt: Date;
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  author?: Maybe<User>;
  createdAt: Date;
  id: string;
  message: Maybe<string>;
  post: Post;
  reply?: Maybe<Array<Reply>>;
  updatedAt: Date;
};

export type Reply = {
  __typename?: 'ReplyCommentPost';
  author?: Maybe<User>;
  createdAt: Date;
  id: string;
  message: string;
  parent: Comment;
  updatedAt: Date;
};

export type Notification = {
  __typename?: 'Notification';
  content: string;
  createdAt: Date;
  id: string;
  owner: User;
  read: boolean;
  requester: User;
  type: string;
  updatedAt: Date;
};

export type Friendship = {
  __typename?: 'Friendship';
  accepted: boolean;
  addressee: User;
  createdAt: Date;
  id: string;
  requester: User;
  updatedAt: Date;
};

export type Image = {
  __typename?: 'Image';
  fileName: Maybe<string>;
  id: string;
  post: Maybe<Post>;
  type: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
  url: string;
};

export interface Conversation extends Model {
  title: Maybe<string>;
  type: 'groups' | 'private';
  owner: User;
  receiver: Array<User>;
  lastMessage: string;
  lastSendUser: User;

  participants: Array<Participant>;
}
export interface Participant extends Model {
  seen: boolean;
  totalSeen: number;
  conversation: Conversation;
  user: User;
}

export interface Message extends Model {
  message: string;
  sender: User;
  conversation: Conversation;
}

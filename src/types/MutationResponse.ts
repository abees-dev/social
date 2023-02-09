import {
  AddFriendResponse,
  BaseResponse,
  createConversationResponse,
  CreatePostResponse,
  LikePostResponse,
  UpdateUserProfileResponse,
  UserResponse,
} from './Response';

export type Mutation = {
  login: UserResponse;
  register: UserResponse;
  logout: LogoutMutation;
  markAsRead: BaseResponse;
  createComment: BaseResponse;
  replyComment: BaseResponse;
  createPost: CreatePostResponse;
  addFriend: AddFriendResponse;
  likePost: LikePostResponse;
  unLikePost: BaseResponse;
  updateProfile: UpdateUserProfileResponse;
  createConversation: createConversationResponse;
};

export type LoginMutation = Pick<Mutation, 'login'>;
export type RegisterMutation = Pick<Mutation, 'register'>;
export type LogoutMutation = Pick<Mutation, 'logout'>;
export type MaskAsReadMutation = Pick<Mutation, 'markAsRead'>;
export type CreateCommentMutation = Pick<Mutation, 'createComment'>;
export type ReplyCommentMutation = Pick<Mutation, 'replyComment'>;
export type CreatePostMutation = Pick<Mutation, 'createPost'>;
export type AddFriendMutation = Pick<Mutation, 'addFriend'>;
export type LikePostMutation = Pick<Mutation, 'likePost'>;
export type UnLikePostMutation = Pick<Mutation, 'unLikePost'>;
export type UpdateProfileMutation = Pick<Mutation, 'updateProfile'>;
export type CreateConversationMutation = Pick<Mutation, 'createConversation'>;

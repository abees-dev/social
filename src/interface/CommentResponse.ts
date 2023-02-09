import { Upload } from 'src/types/UploadResponse';
import { IUserResponse } from 'src/interface/UserReponse';
import { FileType } from 'src/types/Base';

export interface ICommentResponse {
  _id: string;
  comment_reply_id: string;
  content: string;
  deleted: number;
  no_of_angry: number;
  no_of_dear: number;
  no_of_haha: number;
  no_of_like: number;
  no_of_love: number;
  no_of_reaction: number;
  no_of_reply: number;
  no_of_sad: number;
  no_of_wow: number;
  post_id: string;
  status: number;
  thumbnail: string;
  media: Upload;
  tag: IUserResponse[];
  user: IUserResponse;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  my_reaction: number;
}

export interface ICreateComment {
  post_id: string;
  content: string;
  tag: string[];
  media: string;
  comment_reply_id: string;
  thumbnail: string;
  file?: FileType;
}

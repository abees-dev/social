import { IUserResponse } from 'src/interface/UserReponse';
import { Maybe } from 'src/types';
import { Upload } from 'src/types/UploadResponse';

export interface IMessageResponse {
  _id: string;
  conversation_id: string;
  link: string;
  message: string;
  message_reply_id: string;
  thumbnail: string;
  type: number;
  createdAt: string;
  updatedAt: string;
  position: number;
  tag: IUserResponse[];
  medias: Upload[];
  target_user: IUserResponse[];
  user: IUserResponse;
  message_parent: Maybe<IMessageResponse>;
  sticker: string;
}

export interface IMessageBody {
  message: string;
  conversation_id: string;
  link: string;
  medias: string[];
  tag: string[];
  thumbnail: string;
  message_reply_id: string;
  sticker?: string;
}

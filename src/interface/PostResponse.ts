import { IFeelingResponse } from 'src/interface/FeelingResponse';
import { Upload } from 'src/types/UploadResponse';
import { IUserResponse } from './UserReponse';

export interface IPostResponse {
  _id: string;
  title: string;
  view: number;
  caption: string;
  content: string;
  location: string;
  my_reaction: number;
  no_of_angry: number;
  no_of_comment: number;
  no_of_dear: number;
  no_of_haha: number;
  no_of_like: number;
  no_of_love: number;
  no_of_reaction: number;
  no_of_sad: number;
  no_of_shares: number;
  no_of_wow: number;
  position: number;
  status: number;
  updatedAt: string;
  createdAt: string;
  medias: Upload[];
  tag: IUserResponse[];
  user: IUserResponse;
  feeling?: IFeelingResponse;
}

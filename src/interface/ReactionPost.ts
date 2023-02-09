import { IUserResponse } from 'src/interface/UserReponse';

export interface IReactionPostBody {
  post_id: string;
  type: number;
}

export interface IReactionPostRedux extends IReactionPostBody {
  method: number;
}

export interface IReactionPostResponse {
  _id: string;
  object_id: string; // post_id
  object_type: number;
  type: number;
  user: IUserResponse;
  position: number;
  createdAt: string;
  updatedAt: string;
}

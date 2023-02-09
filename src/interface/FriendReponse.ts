import { IUserResponse } from 'src/interface/UserReponse';

export interface IFriendResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
  user: IUserResponse;
  position: number;
  contact_type: number;
}

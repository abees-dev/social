import { IUserResponse } from 'src/interface/UserReponse';

export interface ILoginResponse {
  access_token: string;
  user: IUserResponse;
}

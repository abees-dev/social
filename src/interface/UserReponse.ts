import { ICityResponse, ICountriesResponse, IDistrictResponse, IWardResponse } from 'src/interface/ProvineReponse';

export interface IUserResponse {
  //se xoa
  id: number;
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  avatar: string;
  gender: number;
  facebook_id: string;
  google_id: string;
  github_id: string;
  address: string;
  city: ICityResponse;
  district: IDistrictResponse;
  ward: IWardResponse;
  country: ICountriesResponse;
  no_of_friends: number;
  no_of_followers: number;
  role: number;
  status: number;
  thumbnail: string;
  user_name: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  contact_type: number;
  position: number;
}

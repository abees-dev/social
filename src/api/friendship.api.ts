import axiosInstance from 'src/utils/axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { IFriendResponse } from 'src/interface/FriendReponse';
import { AxiosResponse } from 'axios';
import { IUserResponse } from 'src/interface/UserReponse';
import { FriendQueryInput } from 'src/interface/QueryInput';

// Path: src/api/friendship.api.ts
export const getListFriend = async (userId: string, query?: FriendQueryInput): Promise<IFriendResponse[]> => {
  const response: AxiosResponse<IBaseResponse<IFriendResponse[]>> = await axiosInstance({
    url: `/friend/${userId}`,
    method: 'get',
    params: query,
  });

  return response.data.data;
};

export const getFriendRequest = async (query?: FriendQueryInput) => {
  const response: AxiosResponse<IBaseResponse<IFriendResponse[]>> = await axiosInstance({
    url: '/friend/request/send',
    method: 'get',
    params: query,
  });
  return response.data.data;
};

export const getFriendReceived = async (query?: FriendQueryInput) => {
  const response: AxiosResponse<IBaseResponse<IFriendResponse[]>> = await axiosInstance({
    url: '/friend/request/receive',
    method: 'get',
    params: query,
  });
  return response.data.data;
};

export const getSuggestions = async (query?: FriendQueryInput) => {
  const response: AxiosResponse<IBaseResponse<IUserResponse[]>> = await axiosInstance({
    url: '/friend/suggest',
    method: 'get',
    params: query,
  });
  return response.data.data;
};

export const addFriend = async (user_id: string) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    url: `/friend/add/${user_id}`,
    method: 'post',
  });
  return response.data;
};

export const acceptFriend = async (user_id: string) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    url: `/friend/accept/${user_id}`,
    method: 'post',
  });
  return response.data;
};

export const revokeRequest = async (user_id: string) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    url: `/friend/revoke-request/${user_id}`,
    method: 'post',
  });
  return response.data;
};

export const removeFriend = async (user_id: string) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    url: `/friend/remove/${user_id}`,
    method: 'post',
  });
  return response.data;
};

export const deniedRequest = async (user_id: string) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    url: `/friend/denied/${user_id}`,
    method: 'post',
  });
  return response.data;
};

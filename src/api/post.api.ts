import { AxiosResponse } from 'axios';
import { HttpStatus } from 'src/enums/httpStatus';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { IFeelingResponse } from 'src/interface/FeelingResponse';
import { IPostResponse } from 'src/interface/PostResponse';
import { FeelingQueryInput } from 'src/interface/QueryInput';
import { PostInput, QueryInput } from 'src/types/InputValue';
import axiosInstance from 'src/utils/axios';

export const createPost = async (data: PostInput): Promise<IBaseResponse<IPostResponse>> => {
  const response: AxiosResponse<IBaseResponse<IPostResponse>> = await axiosInstance({
    method: 'post',
    url: '/post',
    data,
  });
  return response.data;
};

export const getPost = async (query?: QueryInput): Promise<IPostResponse[]> => {
  const response: AxiosResponse<IBaseResponse<IPostResponse[]>> = await axiosInstance({
    method: 'get',
    url: '/post',
    params: {
      ...query,
      user_id: '',
    },
  });
  if (response.data.status == HttpStatus.OK) {
    return response.data.data;
  }
  return [];
};

export const removePost = async (postId: string): Promise<IBaseResponse> => {
  const response = await axiosInstance({
    method: 'delete',
    url: `/post/${postId}`,
  });
  return response.data;
};

export const getFeelingPost = async (query?: FeelingQueryInput): Promise<IFeelingResponse[]> => {
  const response: AxiosResponse<IBaseResponse<IFeelingResponse[]>> = await axiosInstance({
    method: 'get',
    url: '/post/feeling',
    params: query,
  });
  return response.data.data;
};

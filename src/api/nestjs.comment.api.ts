import { QueryInput } from 'src/types/InputValue';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { ICommentResponse, ICreateComment } from 'src/interface/CommentResponse';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { HttpStatus } from 'src/enums/httpStatus';

export const getCommentByPost = async (postId: string, query?: QueryInput): Promise<ICommentResponse[]> => {
  const response: AxiosResponse<IBaseResponse<ICommentResponse[]>> = await axiosInstance({
    method: 'get',
    url: `/comment/${postId}`,
    params: query,
  });
  if (response.data.status === HttpStatus.OK) {
    return response.data.data;
  }
  return [];
};

export const createComment = async (data: ICreateComment): Promise<IBaseResponse<ICommentResponse>> => {
  const response: AxiosResponse<IBaseResponse<ICommentResponse>> = await axiosInstance({
    method: 'post',
    url: `/comment/create`,
    data: data,
  });
  return response.data;
};

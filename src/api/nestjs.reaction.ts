import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { ReactionQueryInput } from 'src/interface/QueryInput';
import { IReactionPostBody, IReactionPostResponse } from 'src/interface/ReactionPost';
import axiosInstance from 'src/utils/axios';

export const reactionPost = async (data: IReactionPostBody): Promise<IBaseResponse> => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    method: 'POST',
    url: '/reaction/post',
    data,
  });
  return response.data;
};

export const getListReaction = async (
  post_id: string,
  query?: ReactionQueryInput
): Promise<IReactionPostResponse[]> => {
  const response: AxiosResponse<IBaseResponse<IReactionPostResponse[]>> = await axiosInstance({
    method: 'GET',
    url: `/reaction/${post_id}`,
    params: query,
  });
  return response.data.data;
};

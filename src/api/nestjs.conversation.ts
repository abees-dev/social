import { CreateConversationBody, IConversationCreateResponse, IConversationResponse } from 'src/interface/Conversation';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';

export const createConversation = async (data: CreateConversationBody) => {
  const response: AxiosResponse<IBaseResponse<IConversationCreateResponse>> = await axiosInstance({
    method: 'POST',
    url: '/conversation/create',
    data,
  });

  return response.data;
};

export const getDetailConversation = async (conversationId: string) => {
  const response: AxiosResponse<IBaseResponse<IConversationResponse>> = await axiosInstance({
    method: 'GET',
    url: `/conversation/${conversationId}`,
  });
  return response.data;
};

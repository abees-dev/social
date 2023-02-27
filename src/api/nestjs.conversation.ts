import {
  CreateConversationBody,
  IConversationCreateResponse,
  IConversationResponse,
  ICountUnreadResponse,
} from 'src/interface/Conversation';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { ConversationQueryInput } from 'src/interface/QueryInput';

export const createConversation = async (data: CreateConversationBody) => {
  const response: AxiosResponse<IBaseResponse<IConversationCreateResponse>> = await axiosInstance({
    method: 'POST',
    url: '/conversation/create',
    data,
  });

  return response.data;
};

export const getConversation = async (query?: ConversationQueryInput) => {
  const response: AxiosResponse<IBaseResponse<IConversationResponse[]>> = await axiosInstance({
    method: 'GET',
    url: '/conversation',
    params: query,
  });
  return response.data.data;
};

export const getDetailConversation = async (conversationId: string) => {
  const response: AxiosResponse<IBaseResponse<IConversationResponse>> = await axiosInstance({
    method: 'GET',
    url: `/conversation/${conversationId}`,
  });
  return response.data;
};

export const getNoOFUnreadMessage = async () => {
  const response: AxiosResponse<IBaseResponse<ICountUnreadResponse>> = await axiosInstance({
    method: 'GET',
    url: '/conversation/count_unread',
  });
  return response.data;
};

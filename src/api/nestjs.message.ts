import { MessageQueryInput } from 'src/interface/QueryInput';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { IMessageResponse } from 'src/interface/MesssageReponse';

export const getListMessage = async (conversation_id: string, query?: MessageQueryInput) => {
  const response: AxiosResponse<IBaseResponse<IMessageResponse[]>> = await axiosInstance({
    method: 'get',
    url: `/message/${conversation_id}`,
    params: query,
  });
  return response.data?.data || [];
};

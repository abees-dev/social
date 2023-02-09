import { IRegisterDeviceBody } from 'src/interface/RegisterDevice';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';

export const registerDevice = async (data: IRegisterDeviceBody) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    method: 'POST',
    url: '/notification/register-device',
    data,
  });
  return response.data;
};

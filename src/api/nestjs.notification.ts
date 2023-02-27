import { IRegisterDeviceBody } from 'src/interface/RegisterDevice';
import axiosInstance from 'src/utils/axios';
import { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { NotificationQueryInput } from 'src/interface/QueryInput';
import { INotificationResponse } from 'src/interface/Notification';

export const registerDevice = async (data: IRegisterDeviceBody) => {
  const response: AxiosResponse<IBaseResponse> = await axiosInstance({
    method: 'POST',
    url: '/notification/register-device',
    data,
  });
  return response.data;
};

export const unregisterDevice = async (data: Pick<IRegisterDeviceBody, "user_id" | "device_id">) => {
    const response: AxiosResponse<IBaseResponse> = await axiosInstance({
        method: 'POST',
        url: '/notification/delete-device',
        data,
    });
    return response.data;
}

export const getNotification = async (query?: NotificationQueryInput) => {
  const response: AxiosResponse<IBaseResponse<INotificationResponse[]>> = await axiosInstance({
    method: 'GET',
    url: '/notification',
    params: query,
  });

  return response.data.data;
};



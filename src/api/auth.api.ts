import { LoginValues, RegisterValues } from 'src/types/InputValue';
import axios from 'src/utils/axios';
import { ILoginResponse } from 'src/interface/LoginResponse';
import { IBaseResponse } from 'src/interface/BaseResponse';

export const loginRequest = async (data: LoginValues): Promise<IBaseResponse<ILoginResponse>> => {
  const response = await axios.post<IBaseResponse<ILoginResponse>>('/auth/login', data);
  return response.data;
};

export const registerRequest = async (data: RegisterValues): Promise<IBaseResponse> => {
  const response = await axios.post<IBaseResponse>('/auth/register', {
    ...data,
    gender: 0,
  });
  return response.data;
};

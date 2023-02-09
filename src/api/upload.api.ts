import axios, { AxiosResponse } from 'axios';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { Upload } from 'src/types/UploadResponse';

export const uploadSingle = async (data: FormData): Promise<IBaseResponse<Upload>> => {
  const res = await axios({
    method: 'POST',
    url: `${process.env.REACT_APP_UPLOAD_API_URL}/upload/single`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  });

  return res.data;
};

export const uploadMultiple = async (data: FormData): Promise<IBaseResponse<Upload[]>> => {
  const res: AxiosResponse<IBaseResponse<Upload[]>> = await axios({
    method: 'POST',
    url: `${process.env.REACT_APP_UPLOAD_API_URL}/upload/multiple`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  });
  return res.data;
};

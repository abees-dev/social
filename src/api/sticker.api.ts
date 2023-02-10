import axios, { AxiosResponse } from 'axios';
import {
  IStickerPackageInfoResponse,
  IStickerPackageResponse,
  IStickerRecentResponse,
} from 'src/interface/StickerResponse';

const axiosInstance = axios.create({
  baseURL: 'https://messenger.stipop.io/v1',
  headers: {
    apikey: '421f41222c2eec3b0214e465a060c2b4',
  },
});

export const getStickerPackages = async (page: number, userId: string) => {
  const res: AxiosResponse<IStickerPackageResponse> = await axiosInstance({
    method: 'GET',
    url: '/package',
    params: {
      userId: userId,
      limit: 20,
      pageNumber: page,
      language: 'vie',
    },
  });
  return res.data.body.packageList;
};

export const getStickerPackagesUser = async (userId: string, page?: number) => {
  const res: AxiosResponse<IStickerPackageResponse> = await axiosInstance({
    method: 'GET',
    url: `/mysticker/${userId}`,
    params: {
      limit: 20,
      pageNumber: page || 1,
    },
  });

  return res.data.body;
};

export const getRecentlyStickerPackages = async (userId: string) => {
  const res: AxiosResponse<IStickerRecentResponse> = await axiosInstance({
    method: 'GET',
    url: `package/send/${userId}`,
  });

  return res.data.body;
};

export const downLoadStickPackage = async (packageId: number, userId: string) => {
  const res: AxiosResponse<IStickerPackageInfoResponse> = await axiosInstance({
    method: 'POST',
    url: `/download/${packageId}`,
    params: {
      userId: userId,
      isPurchase: 'N',
    },
  });

  console.log(res);
  return res.data;
};

export const getStickerPackageInfo = async (packageId: number, userId: string) => {
  const res: AxiosResponse<IStickerPackageInfoResponse> = await axiosInstance({
    method: 'GET',
    url: `/package/${packageId}`,
    params: {
      userId: userId,
    },
  });

  return res.data.body;
};

export const registerRecentSticker = async (stickerId: number, userId: string) => {
  const res: AxiosResponse<IStickerPackageInfoResponse> = await axiosInstance({
    method: 'POST',
    url: `analytics/send/${stickerId}`,
    params: {
      userId: userId,
    },
  });
  return res.data;
};

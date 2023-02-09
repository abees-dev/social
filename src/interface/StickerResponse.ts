import { Maybe } from 'src/types';

interface IPageMap {
  pageNumber: number;
  onePageCountRow: number;
  totalCount: number;
  pageCount: number;
  groupCount: number;
  groupNumber: number;
  pageGroupCount: number;
  startPage: number;
  endPage: number;
  startRow: number;
  endRow: number;
  modNum: number;
  listStartNumber: number;
}

interface IHeaderResponse {
  code: string;
  status: string;
  message: string;
}

export interface IStickerBaseResponse<Body = any> {
  body: Body;
  header: IHeaderResponse;
}

export interface IStickerStoreResponse {
  packageId: number;
  packageName: string;
  packageImg: string;
  packageCategory: string;
  packageKeywords: string;
  packageAnimated: string;
  isNew: string;
  artistName: string;
  language: string;
  isDownload?: string;
  isWish?: string;
  packageDate?: string;
  price?: string;
  stickers?: Maybe<ISticker[]>;
}

export interface IStickerPackageListResponse {
  packageList: IStickerStoreResponse[];
  pageMap: IPageMap;
}

export interface IStickerPackageInfo {
  package: IStickerStoreResponse;
}

export interface ISticker {
  stickerId: number;
  packageId: number;
  stickerImg: string;
  favoriteYN: string;
}

export interface IStickerRecent {
  stickerList: ISticker[];
  pageMap: IPageMap;
}

export type IStickerPackageResponse = IStickerBaseResponse<IStickerPackageListResponse>;
export type IStickerPackageInfoResponse = IStickerBaseResponse<IStickerPackageInfo>;
export type IStickerRecentResponse = IStickerBaseResponse<IStickerRecent>;

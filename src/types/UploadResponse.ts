export abstract class BaseResponse {
  code?: string;
  message?: string;
}

export interface Upload {
  _id: string;
  url: string;
  mimetype: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadSingleResponse extends BaseResponse {
  upload: Upload;
}

export interface UploadMultipleResponse extends BaseResponse {
  uploads: Upload[];
}

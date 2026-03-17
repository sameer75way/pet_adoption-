declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  interface CloudinaryStorageParams {
    folder?: string;
    allowed_formats?: string[];
    public_id?: (req: any, file: any) => string;
  }

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params?: CloudinaryStorageParams | ((req: any, file: any) => Promise<CloudinaryStorageParams>);
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
  }
}
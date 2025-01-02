import { generateKey } from "@/utils/generalUtils";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

export class R2Client {
  private client: S3Client;
  private bucketName: string;
  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME;
  }
  async uploadImages(files: File[], prefix: string) {
    const uploadedImages: string[] = [];

    try {
      const uploadPromises = files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = generateKey(prefix);
        const uploadParams: PutObjectCommandInput = {
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        };

        await this.client.send(new PutObjectCommand(uploadParams));

        uploadedImages.push(`${process.env.R2_PUBLIC_ENDPOINT}/${key}`);
      });

      // Wait for all uploads to finish
      await Promise.all(uploadPromises);

      return uploadedImages;
    } catch (error) {
      console.error("Batch upload failed:", error);
      throw new Error(`Failed to upload images: ${error}`);
    }
  }

  async deleteImages(imageUrls: string[]): Promise<number> {
    try {
      let deletedCount = 0;
      const deletePromises = imageUrls.map(async (url) => {
        const params: DeleteObjectCommandInput = {
          Bucket: this.bucketName,
          Key: url.split(`${process.env.R2_PUBLIC_ENDPOINT}/`)[1],
        };
        if (params.Key) {
          await this.client.send(new HeadObjectCommand(params));
          await this.client.send(new DeleteObjectCommand(params));
          deletedCount++;
        }
      });
      await Promise.all(deletePromises);
      return deletedCount;
    } catch (error) {
      console.error(error);
      throw new Error(`${error}`);
    }
  }
}

export const r2Client = new R2Client();

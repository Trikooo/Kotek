import {
  DeleteObjectCommand,
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
        const startTime = getCurrentTimeString();

        const buffer = Buffer.from(await file.arrayBuffer());
        const key = `${prefix}/${file.name.replace(/\s+/g, "")}`;
        const uploadParams: PutObjectCommandInput = {
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        };

        console.log(`Start uploading ${file.name} at: ${startTime}`);
        await this.client.send(new PutObjectCommand(uploadParams));
        const endTime = getCurrentTimeString();

        console.log(`Finished uploading ${file.name} at: ${endTime}`);
        uploadedImages.push(`${process.env.R2_ENDPOINT}/${key}`);
      });

      // Wait for all uploads to finish
      await Promise.all(uploadPromises);

      console.log("All files uploaded successfully.");
      return uploadedImages;
    } catch (error) {
      console.error("Batch upload failed:", error);
      throw new Error(`Failed to upload images: ${error}`);
    }
  }

  async deleteImages(imageUrls: string[]): Promise<number> {
    let deletedCount = 0;

    for (const imageUrl of imageUrls) {
      try {
        const key = imageUrl.split(
          `https://pub-${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev/`
        )[1];

        if (!key) continue;

        await this.client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          })
        );

        deletedCount++;
      } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error);
      }
    }

    return deletedCount;
  }
}

export const r2Client = new R2Client();

const getCurrentTimeString = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
};

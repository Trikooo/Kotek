import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = "kotek-bucket";
const key = "products/20241218110740-36c3e8e8-13cd-441c-a575-5d8dd79b67c9";

async function fetchData() {
  try {
    const response = await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key })
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

fetchData();

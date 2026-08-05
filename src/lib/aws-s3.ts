import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Read AWS Configuration from Vite environment variables
const region = import.meta.env.VITE_AWS_REGION || "us-east-1";
const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME || "";
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || "";
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "";

export interface S3UploadResult {
  success: boolean;
  fileUrl?: string;
  key?: string;
  error?: string;
}

export const isS3Configured = (): boolean => {
  return Boolean(bucketName && accessKeyId && secretAccessKey);
};

let s3ClientInstance: S3Client | null = null;

const getS3Client = (): S3Client => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3ClientInstance;
};

/**
 * Upload satellite imagery or dataset file to Amazon S3 Bucket
 */
export const uploadFileToS3 = async (
  file: File,
  folderPrefix: string = "satellite-datasets"
): Promise<S3UploadResult> => {
  try {
    if (!isS3Configured()) {
      return {
        success: false,
        error: "AWS S3 Credentials are not configured in environment variables.",
      };
    }

    const client = getS3Client();
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folderPrefix}/${timestamp}_${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: uint8Array,
      ContentType: file.type || "application/octet-stream",
    });

    await client.send(command);

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return {
      success: true,
      fileUrl,
      key,
    };
  } catch (err: any) {
    console.error("AWS S3 Upload Error:", err);
    return {
      success: false,
      error: err.message || "Failed to upload file to Amazon S3.",
    };
  }
};

/**
 * Get S3 File Public URL from object key
 */
export const getS3PublicUrl = (key: string): string => {
  if (!bucketName) return "";
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

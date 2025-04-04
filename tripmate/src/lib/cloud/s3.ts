// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const REGION = "us-west-2" // e.g. us-east-1
const BUCKET = "tripmatebucket1213 "

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generateUploadUrl(filename: string, type: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: filename,
    ContentType: type,
  })

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }) // 5 min
  return signedUrl
}

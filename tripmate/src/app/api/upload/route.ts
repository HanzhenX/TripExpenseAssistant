import { S3Client, PutObjectCommand , ObjectCannedACL} from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

// Allowed file types
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"]
const MAX_SIZE_MB = 10

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type")
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  }

  const formData = await req.formData()

  const file = formData.get("file") as File | null;

  // If no file is provided and it's optional, return early
  if (!file || file.size === 0) {
    return NextResponse.json({ success: true, url: null });
  }


  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const sizeInMB = buffer.byteLength / (1024 * 1024)
  if (sizeInMB > MAX_SIZE_MB) {
    return NextResponse.json({ error: `File too large. Max size is ${MAX_SIZE_MB}MB` }, { status: 400 })
  }

  const filename = `uploads/${Date.now()}-${file.name}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read" as ObjectCannedACL, // or remove this if you want private access
  }

  try {
    await s3.send(new PutObjectCommand(uploadParams))
    return NextResponse.json({
      success: true,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${filename}`,
    })
  } catch (err) {
    console.error("S3 Upload Error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}


// For signed url 
// import { NextRequest, NextResponse } from "next/server";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { v4 as uuidv4 } from "uuid";

// const s3 = new S3Client({
//     region: process.env.AWS_REGION!,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
// });

// export async function POST(req: NextRequest) {
//     //const { filename, type } = await req.json(); // ❌ This expects JSON
//     const formData = await req.formData();
//     const filename = formData.get("filename")?.toString();
//     const type = formData.get("type")?.toString();

//     const fileKey = `${uuidv4()}-${filename}`;
//     const command = new PutObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET!,
//         Key: fileKey,
//         ContentType: type,
//     });

//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

//     return NextResponse.json({
//         url: signedUrl,
//         fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`,
//     });
// }

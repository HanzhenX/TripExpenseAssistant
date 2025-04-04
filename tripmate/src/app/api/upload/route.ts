import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${uuidv4()}-${file.name}`

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  }

  try {
    await s3.send(new PutObjectCommand(uploadParams))
    return NextResponse.json({ success: true, url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${filename}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}



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

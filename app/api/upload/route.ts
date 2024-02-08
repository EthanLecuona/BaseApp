import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';
import sharp from 'sharp'

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    }
});


async function uploadImageToS3(
        file: Buffer,
        fileName: string
    ): Promise<string> {
        const resizedImageBuffer = await sharp(file)
        .resize(400, 500) // Specify your desired width or height for resizing
        .toBuffer();
        console.log(process.env.AWS_BUCKET_NAME as string)
        console.log(process.env.AWS_ACCESS_KEY_ID as string)
        console.log(process.env.AWS_SECRET_ACCESS_KEY as string)
        console.log(process.env.AWS_REGION as string)
        const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: fileName,
        Body: resizedImageBuffer,
        ContentType: "image/jpeg", // Change the content type accordingly
        };
    
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
    
        return fileName;
    }
  
  export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as Blob | null;
        if (!file) {
            return NextResponse.json(
                { error: "File blob is required." },
                { status: 400 }
            );
        }
        const session = await getServerSession(authOptions);
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session?.user?.email!
            }
        })
        if(!currentUser) {
            return NextResponse.json({ error: "No Current Session."}, { status: 400 }); 
        }

        const mimeType = file.type;
        const fileExtension = mimeType.split("/")[1];
        const newFileName = `${currentUser.id}.${fileExtension}`
        console.log(newFileName)
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = await uploadImageToS3(
            buffer,
            newFileName
        );
        if(!fileName){
            return NextResponse.json({ message: "Error uploading image" });
        }
        const url = `https://picturesbaseapp.s3.eu-north-1.amazonaws.com/${fileName}`
        return NextResponse.json(url);
    } catch (error) {
        console.error("Error uploading image:", error);
        NextResponse.json({ message: "Error uploading image" });
    }
  }





// export async function POST(request: Request, response: NextResponse) {
//     // console.log(await request.formData());
//     // return new NextResponse("Thank you")
//     const formData = await request.formData();
//     const file = formData.get('file') as Blob || null;  
//     console.log(file)
//     if (!file) {
//         return NextResponse.json({ error: "File is required."}, { status: 400 }); 
//     }
    
//     try {
 
//         const session = await getServerSession(authOptions);
//         const currentUser = await prisma.user.findUnique({
//             where: {
//                 email: session?.user?.email!
//             }
//         })
//         if(!currentUser) {
//             return NextResponse.json({ error: "No Current Session."}, { status: 400 }); 
//         }
//         console.log("HI")
//         const fileExtension = file

//         console.log(fileExtension)
//         const newFileName = `${currentUser.id}.${fileExtension}`;
//         const buffer = Buffer.from(await file.arrayBuffer());
//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME!,
//             Key: newFileName,
//             Body: buffer,
//             ContentType: "image/jpg"
//         }
//         await s3Client.send(new PutObjectCommand(params));
//         const url = `https://picturesbaseapp.s3.eu-north-1.amazonaws.com/${newFileName}`

//         return NextResponse.json(url);

//     } catch (error) {
//         return NextResponse.json({ error: "An error occurred while uploading file" }, {status: 500});
//     }
// }
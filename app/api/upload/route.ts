import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';
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
        fileName: string,
        fileType: string,
        folderPath: string,
    ): Promise<string> {
        const resizedImageBuffer = await sharp(file)
        .resize(256, 256) // Specify your desired width or height for resizing
        .toBuffer();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: `${folderPath}/${fileName}`,
            Body: resizedImageBuffer,
            ContentType: fileType, // Change the content type accordingly
        };
        
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `${folderPath}/${fileName}`;
    }
  
  export async function POST(request: NextRequest) {
    const productImage = request.nextUrl.searchParams.get('productImage');
    const userImage = request.nextUrl.searchParams.get('userImage');
    if(productImage == 'true'){
        console.log(productImage)
    }
    try {
        const formData = await request.formData();
        const file = formData.get("file") as Blob | null;
        if (!file) {
            return NextResponse.json(
                { error: "File blob is required." },
                { status: 400 }
            );
        }
        const fileType = file.type;
        const fileExtension = fileType.split("/")[1];
        let newFileName = '';
        if(userImage == 'true') {
            const session = await getServerSession(authOptions);
            const currentUser = await prisma.user.findUnique({
                where: {
                    email: session?.user?.email!
                }
            })
            if(!currentUser) {
                return NextResponse.json({ error: "No Current Session."}, { status: 400 }); 
            }
    
            newFileName = `${currentUser.id}.${fileExtension}`
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = await uploadImageToS3(
                buffer,
                newFileName,
                fileType,
                'profile-pictures'
            );
            if(!fileName){
                return NextResponse.json(null);
            }
            const url = `https://picturesbaseapp.s3.eu-north-1.amazonaws.com/${fileName}`;
    
            await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    image: url
                },
            });
    
            return NextResponse.json(url);
        }
        if(productImage == 'true') {
            const productName = formData.get("name") as string | null;
            newFileName = `${productName}.${fileExtension}`
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = await uploadImageToS3(
                buffer,
                newFileName,
                fileType,
                'products'
            );
            if(!fileName){
                return NextResponse.json(null);
            }
            const url = `https://picturesbaseapp.s3.eu-north-1.amazonaws.com/${fileName}`;
            return NextResponse.json(url);
        }
        if(!productImage && !userImage) {
            return NextResponse.json({ message: "Please specify userImage or productImage." });
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ message: "Error uploading image" });
    }
  }

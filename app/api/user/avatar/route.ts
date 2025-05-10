import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { getServerSession } from 'next-auth';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  // Check if the request contains multipart/form-data
  const contentType = req.headers.get('content-type') || '';

  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    
    const user = await prisma.user.findFirst({
      where: {
        email: session.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Parse the form data to extract the file
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read the file (as a stream or buffer)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert the buffer to Base64 string
    const base64String = buffer.toString('base64');

    // Create a data URI for Cloudinary upload
    const dataURI = `data:${file.type};base64,${base64String}`;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'vintage-picks/avatars',
      public_id: user.id,
      overwrite: true,
    }, () => {
      console.log('Upload in progress');
    });

    console.log('Upload completed:', result);

    // Update the user record with the Cloudinary URL
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: result.secure_url,
      },
    });

    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

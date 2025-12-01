import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import cld from '../cloudinaryConfig';

interface CloudinaryImageProps {
  publicId: string;
  width?: number;
  height?: number;
}

export default function CloudinaryImage({ 
  publicId, 
  width = 300, 
  height = 200 
}: CloudinaryImageProps) {
  const myImage = cld.image(publicId);
  myImage.resize(fill().width(width).height(height));
  
  return <AdvancedImage cldImg={myImage} />;
}
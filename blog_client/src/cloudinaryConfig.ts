// src/cloudinaryConfig.ts
import { Cloudinary } from '@cloudinary/url-gen';

// Define configuration interface
interface CloudinaryConfig {
  cloud: {
    cloudName: string;
    apiKey?: string;     // Optional for frontend (usually only needed for uploads)
    apiSecret?: string;  // NEVER expose this in frontend!
  };
}

const config: CloudinaryConfig = {
  cloud: {
    cloudName: 'dif3z0kkk', // Replace with your actual cloud name
    // apiKey and apiSecret should only be used on server-side
    // for uploads. Never include them in frontend code!
  }
};

const cld = new Cloudinary(config);

export default cld;
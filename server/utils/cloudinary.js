// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary config using environment variables
cloudinary.config({
  cloud_name: "dxgx6gowc",
  api_key: "187925557338723",
  api_secret: "qe7O1S69sQN8n5Bgm3jgbDeNL2g",
});

console.log("Cloudinary config:", cloudinary.config());



// Create a Multer-compatible storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'docSignerUploads',
    resource_type: 'raw',   // <== CRITICAL FOR PDFs
    allowed_formats: ['pdf'],
  },
});


export { cloudinary, storage };

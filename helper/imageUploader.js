import multer from 'multer';
import path from 'path';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name to a timestamp + original extension
  }
});

const upload = multer({ storage: storage });

// Middleware for image upload
export const imageUpload = upload.single('carImage');

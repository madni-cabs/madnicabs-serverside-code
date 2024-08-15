import express from 'express';
import fs from 'fs';
import path from 'path';

const imagesRouter = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');

// Route to get all images from the /uploads folder
imagesRouter.get('/uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }

    const images = files.map((filename, index) => ({
      id: index + 1,
      filename,
      name: path.parse(filename).name,
    }));

    res.json(images);
  });
});

// Route to get an image by name
imagesRouter.get('/uploads/:name', (req, res) => {
  const { name } = req.params;
  const filePath = path.join(uploadDir, name);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Image not found');
  }
});

// Route to delete an image by name
imagesRouter.delete('/uploads/:name', (req, res) => {
  const { name } = req.params;
  const filePath = path.join(uploadDir, name);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.send('Image deleted successfully');
  } else {
    res.status(404).send('Image not found');
  }
});

export default imagesRouter;

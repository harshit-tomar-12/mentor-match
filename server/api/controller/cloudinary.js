const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Upload an image to Cloudinary
cloudinary.uploader.upload('path_to_your_image.jpg', function(error, result) {
  if (error) {
    console.error('Error uploading image:', error);
  } else {
    console.log('Image uploaded successfully:', result);
    // You can now store the public URL of the uploaded image in your database
    const imageUrl = result.secure_url;
  }
});

// Upload a video to Cloudinary
cloudinary.uploader.upload('path_to_your_video.mp4', { resource_type: 'video' }, function(error, result) {
  if (error) {
    console.error('Error uploading video:', error);
  } else {
    console.log('Video uploaded successfully:', result);
    // You can now store the public URL of the uploaded video in your database
    const videoUrl = result.secure_url;
  }
});

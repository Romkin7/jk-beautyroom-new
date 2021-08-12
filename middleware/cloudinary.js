const cloudinary = require('cloudinary').v2;
const fs = require('fs');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV === 'production' ? true : false,
});

module.exports.uploadImage = async (req, res, next) => {
 try {
     const stream = cloudinary.uploader.upload_stream(function (error, result) {
         req.session.publicId = result.public_id;
         req.session.secureUrl = result.secure_url;
         next();
     });
     stream.write(req.files.image.data);
     stream.end();
 } catch(error) {
     return next(error);
 }
}
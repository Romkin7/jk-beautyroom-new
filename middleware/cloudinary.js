const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV === 'production' ? true : false,
});

module.exports.uploadImage = async (req, res, next) => {
    try {
        if (req.files.image) {
            const stream = cloudinary.uploader.upload_stream(function (
                error,
                result,
            ) {
                req.session.publicId = result.public_id;
                req.session.secureUrl = result.secure_url;
                next();
            });
            stream.write(req.files.image.data);
            stream.end();
        } else {
            return next();
        }
    } catch (error) {
        return next(error);
    }
};

module.exports.deleteImage = async (req, res, next) => {
    try {
        await cloudinary.uploader.destroy(req.body.publicId);
        next();
    } catch (error) {
        return next(error);
    }
};

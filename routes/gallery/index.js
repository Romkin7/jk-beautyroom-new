const express = require('express');
const router = express.Router();
const authObj = require('../../middleware/authObj');
const cloudinary = require('../../middleware/cloudinary');
const GalleryItem = require('../../models/galleryItem');
const GalleryItemClass = require('../../classes/galleryItemClass');

router.get('/new', (req, res) => {
    return res.render('gallery/new', {
        layout: 'adminLayout'
    });
});

router
    .route('/')
    .get(async (req, res, next) => {
        try {
           const galleryItems = await GalleryItem.find();
           return res.render('gallery/index', {
               galleryItems,
               layout: 'adminLayout'
           });
        } catch (error) {
            return next(error);
        }
    })
    .post(authObj.isLoggedIn, authObj.isAdmin, cloudinary.uploadImage, async (req, res, next) => {
        try {
            const galleryItemClass = new GalleryItemClass(
                req.body, req.session.publicId, req.session.secureUrl
            ).filterGalleryItem();
            if (galleryItemClass.validateGalleryItem(galleryItemClass)) {
                const galleryItem = await GalleryItem.create(galleryItemClass);
                req.session.publicId = null;
                req.session.secureUrl = null;
                req.flash(
                    'success',
                    'Onnistui, Kuva ' +
                        galleryItem.title +
                        ' on onnistuneesti lisätty galeriaan!',
                );
                return res.redirect('/admin/galleryitems');
            }
        } catch (error) {
            return next(error);
        }
    });

module.exports = router;

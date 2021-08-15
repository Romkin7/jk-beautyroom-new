const express = require('express');
const router = express.Router();
const authObj = require('../../middleware/authObj');
const cloudinary = require('../../middleware/cloudinary');
const Content = require('../../models/content');
const ContentClass = require('../../classes/contentClass');

router.get('/new', (req, res) => {
    return res.render('admin/content/new', {
        layout: 'adminLayout',
    });
});

router
    .route('/')
    .get(async (req, res, next) => {
        try {
            const contents = await Content.find();
            return res.render('admin/content/index', {
                contents,
                layout: 'adminLayout',
            });
        } catch (error) {
            return next(error);
        }
    })
    .post(
        authObj.isLoggedIn,
        authObj.isAdmin,
        cloudinary.uploadImage,
        async (req, res, next) => {
            try {
                const contentClass = new ContentClass(
                    req.body,
                    req.session.publicId,
                    req.session.secureUrl,
                ).filterContent();
                if (contentClass.validateContent(contentClass)) {
                    const content = await Content.create(
                        contentClass,
                    );
                    req.session.publicId = null;
                    req.session.secureUrl = null;
                    req.flash(
                        'success',
                        'Onnistui, sisältö "' +
                            content.title +
                            '" on onnistuneesti lisätty sisältöihin!',
                    );
                    return res.redirect('/admin/contents');
                }
            } catch (error) {
                return next(error);
            }
        },
    );

router
    .route('/:id')
    .get(authObj.isLoggedIn, authObj.isAdmin, async (req, res, next) => {
        try {
            const content = await Content.findById(req.params.id);
            return res.render('admin/content/edit', {
                content,
                layout: 'adminLayout',
            });
        } catch (error) {
            return next(error);
        }
    })
    .put(authObj.isLoggedIn, authObj.isAdmin, async (req, res, next) => {
        try {
            const content = await Content.findById(req.params.id);
            content.title = req.body.title;
            content.category = req.body.category;
            await content.save();
            req.flash(
                'success',
                'Onnistui, Sisällön "' +
                    req.body.title +
                    '" tietoja on onnituneesti päivitetty!',
            );
            return res.redirect('/admin/contents');
        } catch (error) {
            return next(error);
        }
    })
    .delete(
        authObj.isLoggedIn,
        authObj.isAdmin,
        cloudinary.deleteImage,
        async (req, res, next) => {
            try {
                const content = await Content.findById(req.params.id);
                await Content.findByIdAndDelete(req.params.id);
                req.flash(
                    'warning',
                    'Onnistui Sisältö "' +
                        content.title +
                        '" on onnistuneesti poistettu!',
                );
                return res.redirect('/admin/contents');
            } catch (error) {
                return next(error);
            }
        },
    );

module.exports = router;

const express = require('express');
const router = express.Router();
const Service = require('../../models/service');
const GalleryItem = require('../../models/galleryItem');
const Content = require('../../models/content');

router.get('/', async(req, res, next) => {
    try {
        const specialOffers = await Service.find({ discount: true })
            .limit(3);
        const contents = await Content.find({category: 'frontPage'});
            return res.render('index/index', {
                specialOffers,
                contents,
                title: 'Tarjouksia',
            });
    } catch(error) {
        return next(error);
    }
});

router.get('/kampaamo', async (req, res, next) => {
    try {
        const haircutServices = await Service.find({
            category: 'haircutServices',
        }).sort({ price: 1 });
        const hairColorServices = await Service.find({
            category: 'hairColorServices',
        }).sort({ price: 1 });
        const hairColorMixServices = await Service.find({
            category: 'hairColorMixServices',
        }).sort({
            price: 1,
        });
        const contents = await Content.find({category: 'barberPage'});
        return res.render('index/barber', {
            hairColorMixServices,
            hairColorServices,
            contents,
            haircutServices,
            haircutTitle: 'Parturi kampaamo palvelut',
            hairColorTitle: 'Värjäys',
            hairColorMixTitle: 'Väripaketti',
            title: 'Parturi - kampaamo',
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/galleria', async(req, res, next) => {
    try {
         const galleryItems = await GalleryItem.find()
             .sort({ category: 1, createdAt: -1 })
             .limit(50);
        const contents = await Content.find({category: 'galleryPage'});
         return res.render('index/galleria', {
             contents,
             title: 'Galleria',
             subtitle: 'Ennen ja jälkeen',
             galleryItems,
         });
    } catch(error) {
        return next(error);
    }
})

router.get('/rakennekynnet', async (req, res, next) => {
    try {
        const nailServices = await Service.find({
            category: 'nailsServices',
        }).sort({ price: 1 });
        const contents = await Content.find({ category: 'nailsPage' });
        return res.render('index/nails', {
            nailServices,
            contents,
            nailsTitle: 'Kynnet',
            title: 'Rakennekynnet',
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/jalkahoito', async (req, res, next) => {
    try {
        const footcareServices = await Service.find({
            category: 'footcareServices',
        }).sort({ price: 1 });
        const contents = await Content.find({ category: 'footcarePage' });
        return res.render('index/footcare', {
            footcareServices,
            contents,
            footcareTitle: 'Jalkahoidot',
            title: 'Jalkahoito',
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/yhteystiedot', async(req, res, next) => {
    try {
        const contents = await Content.find({ category: 'contactPage' });
        return res.render('index/contact', {
            contents,
            title: 'Yhteystiedot',
        });
    } catch(error) {
        return next(error);
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Service = require('../../models/service');

router.get('/', async(req, res, next) => {
    try {
        const specialOffers = await Service.find({ discount: true })
            .limit(3)
            return res.render('index/index', {
                specialOffers,
                specialOffersTitle: 'Tarjouksia',
                title: 'JK Beauty Room',
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
        return res.render('index/barber', {
            hairColorMixServices,
            hairColorServices,
            specialOffers,
            haircutServices,
            haircutTitle: 'Parturi kampaamo palvelut',
            hairColorTitle: 'Värjäys',
            hairColorMixTitle: 'Väripaketti',
            title: 'Parturi - kampaamo palvelut',
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
         return res.render('index/galleria', {
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
        return res.render('index/nails', {
            nailServices,
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
        return res.render('index/footcare', {
            footcareServices,
            footcareTitle: 'Jalkahoidot',
            title: 'Jalkahoito',
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/yhteystiedot', (req, res) => {
    return res.render('index/contact', {
        title: 'Yhteystiedot',
    });
});

module.exports = router;

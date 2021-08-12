const express = require('express');
const router = express.Router();
const Service = require('../../models/service');

router.get('/', (req, res, next) => {
    return res.render('index/index', {
        title: 'JK Beauty Room',
    });
});

router.get('/kampaamo', async (req, res, next) => {
    try {
        const haircutServices = await Service.find({
            category: 'haircutServices',
        }).sort({ price: 1 });
        console.log(haircutServices);
        const hairColorServices = await Service.find({
            category: 'hairColorServices',
        }).sort({ price: 1 });
        const hairColorMixServices = await Service.find({
            category: 'hairColorMixServices',
        }).sort({
            price: 1,
        });
        return res.render('barber/index', {
            hairColorMixServices,
            hairColorServices,
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
         return res.render('gallery/index', {
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
        return res.render('nails/index', {
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
        return res.render('footcare/index', {
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

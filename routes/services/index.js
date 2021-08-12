const { Router } = require('express');
const router = Router();
const ServiceClass = require('../../classes/serviceClass');
const Service = require('../../models/service');
const authObj = require('../../middleware/authObj');

router.get('/new', (req, res, next) => {
    return res.render('services/new', {
        layout: 'adminLayout',
    });
});

router
    .route('/')
    .get(async (req, res, next) => {
        try {
            const haircutServices = await Service.find({
                category: 'haircutServices',
            }).sort({ price: 1 });
            const hairColorServices = await Service.find({
                category: 'hairColorServices',
            }).sort({ createdAt: 1 });
            const hairColorMixServices = await Service.find({
                category: 'hairColorMixServices',
            }).sort({
                price: 1,
            });
            const nailServices = await Service.find({
                category: 'nailsServices',
            }).sort({ price: 1 });
            const footcareServices = await Service.find({
                category: 'footcareServices',
            }).sort({ price: 1 });
            return res.render('services/', {
                hairColorMixServices,
                hairColorServices,
                haircutServices,
                nailServices,
                footcareServices,
                title: 'Palveluiden hallinta',
                layout: 'adminLayout',
            });
        } catch (error) {
            return next(error);
        }
    })
    .post(authObj.isLoggedIn, authObj.isAdmin, async (req, res, next) => {
        try {
            const serviceClass = new ServiceClass(req.body).filterService();
            if (serviceClass.validateService(serviceClass)) {
                const service = await Service.create(serviceClass);
                req.flash(
                    'success',
                    'Onnistui, Palvelu ' +
                        service.name +
                        ' hinnastoon on onnistuneesti luotu!',
                );
                return res.redirect('/admin/services/new');
            } else {
                req.flash(
                    'error',
                    'Ups, Palvelun luominen epäonnistui, puutteellisten tietojen vuoksi. Olehyvä ja tarkista, että kakki tiedot ovat täytetty oiken.',
                );
                return res.redirect('/admin/services/new');
            }
        } catch (error) {
            return next(error);
        }
    });

router
    .route('/:id')
    .get(authObj.isLoggedIn, authObj.isAdmin, async (req, res, next) => {
        try {
            const service = await Service.findById(req.params.id);
            return res.render('services/edit', {
                service,
                layout: 'adminLayout',
            });
        } catch (error) {
            return next(error);
        }
    })
    .put(authObj.isLoggedIn, authObj.isAdmin, async(req, res, next) => {
        try {
            const serviceClass = new ServiceClass(req.body).filterService();
            if(serviceClass.validateService(serviceClass)) {
                await Service.findByIdAndUpdate(req.params.id, serviceClass);
                req.flash("success", "Onnistui, palvelun " + serviceClass.name + " tietoja on onnistuneesti päivitetty!");
                return res.redirect('/admin/services');
            }
        } catch(error) {
            return next(error);
        }
    })
    .delete(authObj.isLoggedIn, authObj.isAdmin, async (req, res, next) => {
        try {
            const service = await Service.findById(req.params.id);
            console.log(service.name);
            await Service.findByIdAndDelete(req.params.id);
            req.flash(
                'success',
                'Onnistui, Palvelu ' +
                    service.name +
                    ' on onnistuneesti poistettu!',
            );
            return res.redirect('/admin/services');
        } catch (error) {
            return next(error);
        }
    });

module.exports = router;

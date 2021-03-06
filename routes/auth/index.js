const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authObj = require('../../middleware/authObj');
const cloudinary = require('../../middleware/cloudinary');
const UserClass = require('../../classes/userClass');
const User = require('../../models/user');

/** Login routes get and post */
router
    .route('/login')
    .get(authObj.notLoggedIn, (req, res, next) => {
        return res.render('admin/auth/login', {
            layout: 'adminLayout',
        });
    })
    .post(
        authObj.notLoggedIn,
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true,
        }),
    );

/** Signup routes get and post */
router
    .route('/signup')
    .get(authObj.notLoggedIn, (req, res, next) => {
        return res.render('admin/auth/signup', {
            layout: 'adminLayout',
        });
    })
    .post(
        authObj.notLoggedIn,
        cloudinary.uploadImage,
        async (req, res, next) => {
            try {
                const userClass = new UserClass(
                    req.body,
                    req.session.publicId,
                    req.session.secureUrl,
                ).filterUser();
                if (userClass.validateUser(userClass)) {
                    const user = await User.create(userClass);
                    req.session.publicId = null;
                    req.session.secureUrl = null;
                    req.flash(
                        'success',
                        'Rekisteröityminen onnistui, ' +
                            user.username +
                            ' tervetuloa JK Beautyroom adminiksi. Pääsette hallinpaneeliin, kun ylläpitäjä on tarkistanut ja aktivoinut tilinne.',
                    );
                    return res.redirect('/login');
                }
            } catch (error) {
                return next(error);
            }
        },
    );

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Kiitos käynnistä, tervetuloa uudelleen!');
    res.redirect('/login');
});

module.exports = router;

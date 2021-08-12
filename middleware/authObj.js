//Configure authObject
let authObj = {};
authObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash(
            'error',
            'Vain rekisteröityneet ja kirjautuneet käyttäjät ovat oikeutettuja tähän.',
        );
        return res.redirect('/login');
    }
};
authObj.notLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'Ups! Olette jo kirjautuneet Hallintapaneeliin.');
        return res.redirect('/');
    } else {
        next();
    }
};

authObj.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'basic') {
        return next();
    } else {
        req.flash('error', 'Vain Adminkäyttäjät ovat oikeutettuja tähän.');
        res.redirect('/');
    }
};
authObj.checkUltimateAdminLevel = (req, res, next) => {
    if (
        req.isAuthenticated() &&
        req.user.role === 'ultimate'
    ) {
        return next();
    } else {
        req.flash(
            'error',
            'Vain täydet sivuston ylläpito-oikeudet omaavat adminkäyttäjät, ovat oikeutettuja tähän.',
        );
        res.redirect('/admin');
    }
};
//Export authObject
module.exports = authObj;

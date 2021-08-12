const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('./../models/user');

//Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .select('-password')
        .exec((err, user) => {
            done(err, user);
        });
});

passport.use(
    'local',
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, {
                    message:
                        'Käyttäjää ei löytynyt antamallanne sähköpostiosoitteella!',
                });
            } else if (!user.comparePassword(password)) {
                return done(null, false, {
                    message:
                        'Väärä salasana, tarkista isot ja pienet kirjaimet sekä, että caps lock näppäin ei ole päällä.',
                });
            } else {
                return done(
                    null,
                    user,
                    req.flash(
                        'success',
                        'Arvoisa ' +
                            user.username +
                            ', tervetuloa takaisin JK Beautyroom Hallintapaneeliin.',
                    ),
                );
            }
        },
    ),
);

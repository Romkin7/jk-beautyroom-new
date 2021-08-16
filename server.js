if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
require('./dbConnection');
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const sanitizer = require('express-sanitizer');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const MongoStore = require('connect-mongo');
const methodOverRide = require('method-override');
/** Set and require view engine */
const exphbs = require('express-handlebars');

/** Import internal lists */
const {
    serviceCategories,
    pageCategories,
} = require('./dynamicContent/inputFields');
const { links, sidebarLinks } = require('./dynamicContent/navbar');
const { servicesCardList } = require('./dynamicContent/servicesCardList');
/** errorHandler */
const errorHandler = require('./utils/errorHandler');

/** Import Routes */
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const galleryItemRoutes = require('./routes/gallery');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');

const app = express();

/** Configure app security and performance */
app.use(compression());
// app.use(helmet());

//Set up static folder
app.use(express.static(path.join(__dirname + '/public'), { maxAge: 0 }));
/*Setup View engine*/
app.engine(
    '.hbs',
    exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    }),
);
app.set('view engine', '.hbs');

/** Configure app security and performance */
app.use(sanitizer());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(methodOverRide('_method'));

morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});

/** Set apps PORT & IP */
app.set('trust proxy', true);
app.set('port', process.env.PORT || 8080);
app.set('ip', process.env.IP || '127.0.0.1');
//Headers
// https://www.jkbeautyroom.fi
//app.disable('x-powered-by');
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'https://www.jkbeautyroom.fi');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

/** Initialize Session */
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({
            mongoUrl:
                process.env.NODE_ENV === 'production'
                    ? process.env.MONGODB_URI
                    : process.env.DATABASE,
            ttl: 1 * 24 * 60 * 60, // = 1 day. Default
            autoRemove: 'native', // Default
        }),
        resave: false,
        saveUninitialized: false,
        proxy: true,
    }),
);

/** Initialize passport */
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport');

/** Setup flash */
app.use(flash());

/** Set global app locals */
app.use((req, res, next) => {
    res.locals.servicesCardList = servicesCardList;
    res.locals.pageCategories = pageCategories;
    res.locals.serviceCategories = serviceCategories;
    res.locals.sidebarLinks = sidebarLinks;
    res.locals.navbarLinks = links;
    res.locals.session = req.session;
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    next();
});

/** Use Routes */
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/services', serviceRoutes);
app.use('/admin/galleryitems', galleryItemRoutes);
app.use('/admin/contents', contentRoutes);
//Not found 404 generic page
app.get('*', function (req, res, next) {
    return res.redirect('/error404');
});

app.use(errorHandler);

app.listen(app.get('port'), app.get('ip'), () => {
    console.log(
        'JK-Room Beauty backend palvelin on startattu ip osiotteessa ' +
            app.get('ip') +
            ' portilla ' +
            app.get('port'),
    );
});

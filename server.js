require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT | 3000;
const secret = '21127561';

const CustomError = require('./modules/error');
const { create } = require('express-handlebars');
const router = require('./routers/_router.r');

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

require('./modules/passport')(app);

const hbs = create({
    extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(secret));
app.use(express.urlencoded({ extended: true }));

app.use('/imgs', express.static('./imgs'))
app.use('/favicon', express.static('./favicon'))
app.use('/js', express.static('./js'));
app.use('/fonts', express.static('./fonts'))

router.use(passport.initialize());
router.use(passport.session());
app.use(flash());
app.use(router);

app.use((req, res, next) => {
    res.status(404).render('error', {
        code: 404,
        error: true,
        msg: 'Page not found.',
        desc: "The page you're looking for doesn't exist."
    });
});

app.use((err, req, res, next) => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    res.status(statusCode).render('error', {
        code: statusCode,
        error: true,
        msg: 'Server Error.',
        desc: err.message
    });
});

app.listen(port, () => console.log(`Netflix listening on port ${port}!`));
const express = require('express');
const path = require('path');
//const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({path: './config/config.env'});

// const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
// const productDetailController = require('./controllers/productDetailController');
// const userController = require('./controllers/userController');
// const storeFrontController = require('./controllers/storeFrontController');
// const storesController = require('./controllers/storesController');
// const productsController = require('./controllers/productsController');



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    cookie: {secure: true}
}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
// app.use('/api/v1/auth',authController);
app.use('/api/product',productController);
// app.use('/api/v1/product-detail',productDetailController);
// app.use('/api/v1/user',userController);
// app.use('/api/v1/storefront',storeFrontController);
// app.use('/api/v1/stores',storesController);
// app.use('/api/v1/products',productsController);

const port = process.env.PORT || 5000;

app.get('*',(req,res) => {
    res.send('./client/build/index.html');
});

app.listen(port, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${port}`));

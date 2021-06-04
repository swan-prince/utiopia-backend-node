const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conn = require('../config/db');
const {googleCreateConnection,googleGetConnectionUrl,googleGetAccount} = require('../config/oauth/google');
const {facebookConfigParams} = require('../config/oauth/facebook');
const axios = require('axios');
const router = express.Router();

router.post('/register',(req,res) => {
    const {firstName,lastName,email,password,phoneNumber} = req.body;
    let errors = [];

    if(!firstName || !lastName || !email || !password){
        errors.push('please enter all fields');
    }

    if(firstName.length > 60){
        errors.push('first name is too large it must be less than 60 characters');
    }

    if(firstName.length < 3){
        errors.push('first name is too small it must be greater than 3 characters');
    }

    if(lastName.length > 60){
        errors.push('last name is too large it must be less than 60 characters');
    }

    if(lastName.length < 3){
        errors.push('last name is too small it must be greater than 3 characters');
    }

    if(email.length > 200){
        errors.push('email is too large it must be less than 200 characters');
    }

    if(email.length < 3){
        errors.push('email is too small it must be greater than 3 characters');
    }

    if(!email.includes('@')){
        errors.push('invalid email');
    }

    if(password.length > 60){
        errors.push('password is too large it must be less than 60 characters');
    }

    if(password.length < 3){
        errors.push('password is too small it must be greater than 3 characters');
    }

    //check to see if the email already exists
    conn.connect(function(err) {
        if (err) throw err;
        conn.query(`SELECT email FROM User WHERE email=${email}`, function (err, user) {
            if (err) console.log(err);

            if(user !== null) errors.push('email already exists');

            if(errors.length > 0) return res.status(400).json({msg: errors});

            bcrypt.genSalt(10,(err,salt) => {
                if(err) throw err;

                bcrypt.hash(password,salt,(err,hash) => {
                    if(err) throw err;

                    //set new password to the generated hash
                    let newPassword = hash;

                    conn.query(`INSERT INTO User (first_name,last_name,email,password,phoneNumber) VALUES (${firstName},${lastName},${email},${newPassword},${phoneNumber})`, function (err, dbRes) {
                        if (err){
                            console.log(err);
                            res.status(500).json({msg: 'server is down right now please try again later'});
                        }

                        conn.query(`SELECT * FROM User WHERE email=${email}`, function (err, user) {
                            if (err) console.log(err);
                            if(!user) return res.status(500).json({msg: 'internal server error please contact our support team'});

                            //create new json web token
                            jwt.sign(
                                {id: user.id},
                                process.env.JWT_SECRET,
                                {expiresIn: 3600},
                                (err,token) => {
                                    if(err) throw err;

                                    const newObj = {
                                        id: user.id,
                                        token
                                    }
                                    return res.status(200).json(newObj);
                                }
                            );
                        });

                        
                    });
                });
            });
        });
    });
});

router.post('/login',(req,res) => {
    const {email,password} = req.body;
    let errors = [];

    if(!email || !password){
        errors.push('please enter all fields');
    }

    if(email.length > 200){
        errors.push('email is too large it must be less than 200 characters');
    }

    if(email.length < 3){
        errors.push('email is too small it must be greater than 3 characters');
    }

    if(!email.includes('@')){
        errors.push('invalid email');
    }

    if(errors.length > 0) return res.status(400).json({msg: errors});

    conn.connect(function(err) {
        if (err){
            console.log(err);
            return res.status(500).json({msg: 'server is down please try again later'});
        }


        conn.query(`SELECT * FROM User WHERE email=${email}`, function (err, user) {
            if (err) console.log(err);
            if(!user) return res.status(400).json({msg: 'email was not found'});

            bcrypt.compare(password,user.password,(err,success) => {
                if(err) throw err;

                if(!success) return res.status(400).json({msg: 'password is invalid for this email'});

                //create new json web token
                jwt.sign(
                    {id: user.id},
                    process.env.JWT_SECRET,
                    {expiresIn: 3600},
                    (err,token) => {
                        if(err) throw err;

                        const newObj = {
                            id: user.id,
                            token
                        }
                        return res.status(200).json(newObj);
                    }
                );
            });
        });
    });
});

router.get('/google',(req,res) => {
    const auth = googleCreateConnection();
    if (!auth){ 
        console.log('auth is not present!!!\n\n\n');
        return res.status(500).json({msg: 'google oauth not connecting'});
    }

    //return the connection url to the front end;
    const authUrl = googleGetConnectionUrl(auth);
    if (!authUrl){ 
        console.log('auth is not present!!!\n\n\n');
        return res.status(500).json({msg: 'google oauth not connecting'});
    }

    return res.status(200).json({url: authUrl});
});

router.get('/googlecred/:code',(req,res) => {
    const auth = googleCreateConnection();

    //grab the code parameter
    const codeParam = req.params.code;
    console.log('codeParam: ', codeParam);

    googleGetAccount(codeParam,(userInfo) => {
        if (!userInfo){ 
            console.log('google auth user info is not present!!!\n\n\n');
            return res.status(500).json({msg: 'google oauth user information not found'});
        }
    
        //check if user is logging in or registering by querying the database for their email
        conn.connect(function(err) {
            if (err) throw err;
            conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                if(!user){
                    //user is registering with this google account
                    conn.query(`INSERT INTO User (googleId,first_name,last_name,email) VALUES (${userInfo.id},${userInfo.firstName},${userInfo.lastName},${userInfo.email})`, function (err, insertRes) {
                        if (err) return res.status(500).json({msg: 'google sign up error'});
    
                        conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                            if (err) console.log(err);
                            if(!user) return res.status(500).json({msg: 'auth controller google register error'});
                
                            //create new json web token
                            jwt.sign(
                                {id: user.id},
                                process.env.JWT_SECRET,
                                {expiresIn: 3600},
                                (err,token) => {
                                    if(err) throw err;
            
                                    const newObj = {
                                        id: user.id,
                                        token
                                    }
                                    return res.status(200).json(newObj);
                                }
                            );
    
                        });
                    });
                }else{
                    //user is logging in with this google account
                    conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                        if (err) console.log(err);
                        if(!user) return res.status(500).json({msg: 'your email was not found'});
            
                        //create new json web token
                        jwt.sign(
                            {id: user.id},
                            process.env.JWT_SECRET,
                            {expiresIn: 3600},
                            (err,token) => {
                                if(err) throw err;
        
                                const newObj = {
                                    id: user.id,
                                    token
                                }
                                return res.status(200).json(newObj);
                            }
                        );
    
                    });
                }
            });
        });
    });
});

router.get('/facebook',(req,res) => {
    const returnParams = facebookConfigParams();
    return res.status(200).json({facebookUrl: `https://www.facebook.com/v4.0/dialog/oauth?${returnParams}`});
});

router.get('/facebook/code/:facebookCode',(req,res) => {
    const code = req.params.facebookCode;

    axios.get('https://graph.facebook.com/v4.0/oauth/access_token',{params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.NODE_ENV === 'development'? 'http://localhost:3000/' : process.env.RETURN_URL,
        code
    }}).then(facebookRes => {
        return res.status(200).json({facebookToken: facebookRes.data.access_token});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({msg: 'facebook access token code param error'});
    });
});

router.get('/facebook/userinfo/:accessToken',(req,res) => {
    const accessToken = req.params.accessToken;

    axios.get('https://graph.facebook.com/me',{params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accesstoken
    }}).then(facebookRes => {
        //check if user is logging in or registering by querying the database for their email
        conn.connect(function(err) {
            if (err) throw err;
            conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                if(!user){
                    //user is registering with this facebook account
                    conn.query(`INSERT INTO User (facebookId,first_name,last_name,email) VALUES (${userInfo.id},${userInfo.firstName},${userInfo.lastName},${userInfo.email})`, function (err, insertRes) {
                        if (err) return res.status(500).json({msg: 'google sign up error'});

                        conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                            if (err) console.log(err);
                            if(!user) return res.status(500).json({msg: 'auth controller google register error'});
                
                            //create new json web token
                            jwt.sign(
                                {id: user.id},
                                process.env.JWT_SECRET,
                                {expiresIn: 3600},
                                (err,token) => {
                                    if(err) throw err;
            
                                    const newObj = {
                                        id: user.id,
                                        token
                                    }
                                    return res.status(200).json(newObj);
                                }
                            );

                        });
                    });
                }else{
                    //user is logging in with this facebook account
                    conn.query(`SELECT * FROM User WHERE email=${userInfo.email}`, function (err, user) {
                        if (err) console.log(err);
                        if(!user) return res.status(500).json({msg: 'your email was not found'});
            
                        //create new json web token
                        jwt.sign(
                            {id: user.id},
                            process.env.JWT_SECRET,
                            {expiresIn: 3600},
                            (err,token) => {
                                if(err) throw err;
        
                                const newObj = {
                                    id: user.id,
                                    token
                                }
                                return res.status(200).json(newObj);
                            }
                        );

                    });
                }
            });
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({msg: 'facebook access token error'});
    })
});

//seller endpoints for authentication
router.route('/seller')
    .post('/register',(req,res) => {
        const {sellerName,storeName,email,password,addressLine1,addressLine2,
            zipcode,city,state,country,contact1,contact2,productDescription} = req.body;
        let errors = [];

        if(!sellerName || !storeName || !addressLine1 || !zipcode || !city || !country || !email || !password){
            errors.push('please enter all fields');
        }

        if(sellerName.length > 20){
            errors.push('seller name is too large it must be less than 60 characters');
        }

        if(sellerName.length < 3){
            errors.push('seller name is too small it must be greater than 3 characters');
        }

        if(storeName.length > 50){
            errors.push('store name is too large it must be less than 60 characters');
        }

        if(storeName.length < 3){
            errors.push('store name is too small it must be greater than 3 characters');
        }

        if(email.length > 200){
            errors.push('email is too large it must be less than 200 characters');
        }

        if(email.length < 3){
            errors.push('email is too small it must be greater than 3 characters');
        }

        if(!email.includes('@')){
            errors.push('invalid email');
        }

        if(password.length > 60){
            errors.push('password is too large it must be less than 60 characters');
        }

        if(password.length < 3){
            errors.push('password is too small it must be greater than 3 characters');
        }

        if(addressLine1.length > 50){
            errors.push('address line 1 is too large it must be less than 50 characters');
        }

        if(addressLine1.length < 3){
            errors.push('address line 1 is too small it must be greater than 3 characters');
        }

        if(addressLine2.length > 50){
            errors.push('address line 2 is too large it must be less than 50 characters');
        }

        if(zipcode.length > 10){
            errors.push('zipcode is too large it must be less than 10 characters');
        }

        if(zipcode.length < 2){
            errors.push('zipcode is too small it must be greater than 2 characters');
        }

        if(city.length > 50){
            errors.push('city is too large it must be less than 50 characters');
        }

        if(city.length < 3){
            errors.push('city is too small it must be greater than 3 characters');
        }

        if(state.length > 50){
            errors.push('state is too large it must be less than 50 characters');
        }

        if(country.length > 50){
            errors.push('country is too large it must be less than 50 characters');
        }

        if(country.length < 3){
            errors.push('country is too small it must be greater than 3 characters');
        }

        if(contact1.length > 50){
            errors.push('contact 1 is too large it must be less than 50 characters');
        }

        if(contact2.length > 50){
            errors.push('contact 2 is too large it must be less than 50 characters');
        }

        if(productDescription.length > 300){
            errors.push('product description is too large it must be less than 300 characters');
        }

        //check to see if the email already exists
        conn.connect(function(err) {
            if (err) throw err;
            conn.query(`SELECT email FROM Seller WHERE email=${email}`, function (err, user) {
                if (err) console.log(err);

                if(user !== null) errors.push('email already exists');

                if(errors.length > 0) return res.status(400).json({msg: errors});

                bcrypt.genSalt(10,(err,salt) => {
                    if(err) throw err;

                    bcrypt.hash(password,salt,(err,hash) => {
                        if(err) throw err;

                        //set new password to the generated hash
                        let newPassword = hash;

                        conn.query(`INSERT INTO Seller (seller_name,storename,email,password,product_description,addressline1,addressline2,\
                            zipcode,city,state,country,contact1,contact2) VALUES (${sellerName},${storeName},${email},${newPassword},\
                                ${productDescription},${addressLine1},${addressLine2},${zipcode},${city},${state},${country},\
                                ${contact1},${contact2})`, function (err, dbRes) {
                            if (err){
                                console.log(err);
                                res.status(500).json({msg: 'server is down right now please try again later'});
                            }

                            conn.query(`SELECT * FROM Seller WHERE email=${email}`, function (err, user) {
                                if (err) console.log(err);
                                if(!user) return res.status(500).json({msg: 'internal server error please contact our support team'});

                                //create new json web token
                                jwt.sign(
                                    {id: user.id},
                                    process.env.JWT_SECRET,
                                    {expiresIn: 3600},
                                    (err,token) => {
                                        if(err) throw err;

                                        const newObj = {
                                            id: user.id,
                                            token
                                        }
                                        return res.status(200).json(newObj);
                                    }
                                );
                            });

                            
                        });
                    });
                });
            });
        });
    })
    .post('/login',(req,res) => {
        const {email,password} = req.body;
        let errors = [];

        if(!email || !password){
            errors.push('please enter all fields');
        }

        if(email.length > 200){
            errors.push('email is too large it must be less than 200 characters');
        }

        if(email.length < 3){
            errors.push('email is too small it must be greater than 3 characters');
        }

        if(!email.includes('@')){
            errors.push('invalid email');
        }

        if(errors.length > 0) return res.status(400).json({msg: errors});

        conn.connect(function(err) {
            if (err){
                console.log(err);
                return res.status(500).json({msg: 'server is down please try again later'});
            }


            conn.query(`SELECT * FROM Seller WHERE email=${email}`, function (err, user) {
                if (err) console.log(err);
                if(!user) return res.status(400).json({msg: 'email was not found'});

                bcrypt.compare(password,user.password,(err,success) => {
                    if(err) throw err;

                    if(!success) return res.status(400).json({msg: 'password is invalid for this email'});

                    //create new json web token
                    jwt.sign(
                        {id: user.id},
                        process.env.JWT_SECRET,
                        {expiresIn: 3600},
                        (err,token) => {
                            if(err) throw err;

                            const newObj = {
                                id: user.id,
                                token
                            }
                            return res.status(200).json(newObj);
                        }
                    );
                });
            });
        });
    });

module.exports = router;
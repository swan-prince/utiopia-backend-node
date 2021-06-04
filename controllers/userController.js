const express = require('express');
const bcrypt = require('bcryptjs');
const conn = require('../config/db');
const auth = require('../config/auth')
const router = express.Router();

router.route('/profile')
    .get('/:userId',auth,(req,res) => {
        const {userId} = req.params;

        conn.connect(function(err) {
            if (err) throw err;

            conn.query(`SELECT * FROM User WHERE id=${userId}`, function (err, user) {
                if (err) console.log(err);

                conn.query(`SELECT * FROM User WHERE id=${userId}`, function (err, userAddress) {
                    if (err) console.log(err);


                    const newObj = {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        email: user.email,
                        password: user.password,
                        phoneNumber: user.phoneNumber,
                        addressLine1: userAddress.addressLine1,
                        addressLine2: userAddress.addressLine2,
                        zipcode: userAddress.zipcode,
                        city: userAddress.city,
                        state: userAddress.state,
                        country: userAddress.country,
                        contact1: userAddress.contact1,
                        contact2: userAddress.contact2
                    };

                    return res.status(200).json(newObj);
                });
            });
        });
    })
    .post(auth,(req,res) => {
        const {userId,firstName,lastName,email,password,phoneNumber,addressLine1,addressLine2,zipcode,
            city,state,country,contact1,contact2} = req.body;

        conn.connect(function(err) {
            if (err) throw err;

            /*
            The user info is queried here so if there is a null field for any of the input from the
            front end, the info here will replace it so no data is loss
            */
            conn.query(`SELECT * FROM User WHERE id=${userId}`, function (err, user) {
                if (err) console.log(err);

                conn.query(`SELECT * FROM UserAddress WHERE userId=${userId}`, function (err, userAddress) {
                    if (err) console.log(err);


                    const userDbObj = {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        email: user.email,
                        password: user.password,
                        phoneNumber: user.phoneNumber,
                        addressLine1: userAddress.addressLine1,
                        addressLine2: userAddress.addressLine2,
                        zipcode: userAddress.zipcode,
                        city: userAddress.city,
                        state: userAddress.state,
                        country: userAddress.country,
                        contact1: userAddress.contact1,
                        contact2: userAddress.contact2
                    };

                    //validate
                    if(!firstName || !lastName || !email || !password){
                        errors.push('please enter all required fields');
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

                    if(phoneNumber.length > 20){
                        errors.push('phone number is too large it must be less than 20 characters');
                    }

                    if(addressLine1.length > 50){
                        errors.push('address is too large it must be less than 50 characters');
                    }

                    if(addressLine2.length > 50){
                        errors.push('address additional details are too large it must be less than 50 characters');
                    }

                    if(zipcode.length > 10){
                        errors.push('zip code is too large it must be less than 10 characters');
                    }

                    if(city.length > 50){
                        errors.push('city is too large it must be less than 50 characters');
                    }

                    if(state.length > 50){
                        errors.push('state is too large it must be less than 50 characters');
                    }

                    if(country.length > 50){
                        errors.push('country is too large it must be less than 50 characters');
                    }

                    if(contact1.length > 50){
                        errors.push('first contact is too large it must be less than 50 characters');
                    }

                    if(contact2.length > 50){
                        errors.push('second contact is too large it must be less than 50 characters');
                    }

                    if(errors.length > 0) return res.status(400).json({msg: errors});

                    bcrypt.genSalt(10,(err,salt) => {
                        if(err) throw err;
        
                        bcrypt.hash(password,salt,(err,hash) => {
                            if(err) throw err;
        
                            //set new password to the generated hash
                            let newPassword = hash;

                            //update the information
                            conn.query(`UPDATE User SET first_name=${firstName.length > 0 ? firstName : userDbObj.firstName},\
                                last_name=${lastName.length > 0 ? lastName : userDbObj.lastName},\
                                email=${email.length > 0 ? email : userDbObj.email},\
                                password=${newPassword},\
                                phoneNumber=${phoneNumber.length > 0 ? phoneNumber : userDbObj.phoneNumber} \
                                WHERE id=${userId}`, function (err, updateRes) {
                                if (err) console.log(err);

                                //update the user address
                                conn.query(`UPDATE UserAddress SET addressLine1=${addressLine1.length > 0 ? addressLine1 : userDbObj.addressLine1},\
                                    addressLine2=${addressLine2.length > 0 ? addressLine2 : userDbObj.addressLine2},\
                                    zipcode=${zipcode.length > 0 ? zipcode : userDbObj.zipcode},\
                                    city=${city.length > 0 ? city : userDbObj.city},\
                                    state=${state.length > 0 ? state : userDbObj.state} \
                                    country=${country.length > 0 ? country : userDbObj.country} \
                                    contact1=${contact1.length > 0 ? contact1 : userDbObj.contact1} \
                                    contact2=${contact2.length > 0 ? contact2 : userDbObj.contact2} \
                                    WHERE userId=${userId}`, function (err, updateAddressRes) {
                                    if (err) console.log(err);

                                    return res.status(200).json({success: 'true'});
                                });
                            });
                        });
                    });
                });
            });
        });
    });

module.exports = router;
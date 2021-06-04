const express = require('express');
const conn = require('../config/db');
const auth = require('../config/auth')
const uuid = require('uuid');
const router = express.Router();

router.post('/select',auth,(req,res) => {
    const {storeUrl} = req.body;

    conn.connect(function(err) {
        if (err) throw err;

        conn.query(`SELECT * FROM Seller WHERE store_url=${storeUrl}`, function (err, seller) {
            if (err) console.log(err);
            const sellerId = seller.id;
            const storeName = seller.storename;
            const storeSlogan = seller.store_slogan;

            conn.query(`SELECT * FROM Product WHERE seller_id=${sellerId}`, function (err, products) {
                if (err) console.log(err);

                return res.status(200).json({
                    sellerId: sellerId,
                    storeName: storeName,
                    storeSlogan: storeSlogan,
                    productList: products
                });
            });
        });
    });
});

router.route('/create')
    .get(auth,(req,res) => {
        const {userId} = req.params;

        conn.connect(function(err) {
            if (err) throw err;
    
            conn.query(`SELECT * FROM Category`, function (err, categories) {
                if (err) console.log(err);

                conn.query(`SELECT * FROM Brands WHERE seller_id=${userId}`, function (err, brand) {
                    if (err) console.log(err);

                    conn.query(`SELECT * FROM Seller WHERE seller_id=${userId}`, function (err, seller) {
                        if (err) console.log(err);

                        return res.status(200).json({
                        categoryList: categories,
                        brandName: brand !== null ? brand.brand_name : '',
                        brandOwnerId: brand !== null ? brand.seller_id : '',
                        storeName: seller.storename !== null ? seller.storename : ''
                        });
                    });
                });
            });
        });
    })
    .post(auth,(req,res) => {
        const {userId,brandName,storeName,categoryId,storeSlogan,nameOrigin} = req.body;

        /*
        for nameOrigin 'r' is for the user entering their store name on the seller registration page,
        'c' is for the user entering their store name on the store front creation page 
        */

        //validate
        if(!userId){
            errors.push('please log in');
        }

        if(!brandName || !storeName){
            errors.push('please enter all required fields');
        }
    
        if(brandName.length > 20){
            errors.push('brand name is too large it must be less than 20 characters');
        }
    
        if(brandName.length < 2){
            errors.push('brand name is too small it must be greater than 2 characters');
        }

        if(storeName.length > 50){
            errors.push('store name is too large it must be less than 50 characters');
        }
    
        conn.connect(function(err) {
            if (err) throw err;
    
            conn.query(`SELECT * FROM Brands WHERE brand_name=${brandName}`, function (err, brand) {
                if (err) console.log(err);

                /*there is already a brand with this name in our database so the 
                user has to choose a different name
                */
                if(brand !== null){
                    errors.push('brand name is already chosen, please choose a different one');
                    return res.status(400).json({msg: errors});
                }

                if(nameOrigin !== 'c'){
                    conn.query(`SELECT * FROM Seller WHERE storename=${storeName.trim().toLowerCase()}`, function (err, store) {
                        if (err) console.log(err);
        
                        /*there is already a brand with this name in our database so the 
                        user has to choose a different name
                        */
                        if(store !== null){
                            errors.push('store name is already chosen, please choose a different one');
                            return res.status(400).json({msg: errors});
                        }

                        if(errors.length > 0){
                            return res.status(400).json({msg: errors});
                        }
        
                        //update the database
                        conn.query(`INSERT INTO Brands (seller_id,brand_name) VALUES (${userId},${brandName})`, function (err, brandRes) {
                            if (err) console.log(err);
        
                            let newUUID = uuid.v4();
                            conn.query(`UPDATE Seller SET storename=${storeName.trim().toLowerCase()},store_url=${newUUID},store_slogan=${storeSlogan.trim().toLowerCase()},store_category=${categoryId} WHERE id=${userId}`, function (err, sellerRes) {
                                if (err) console.log(err);
        
                                return res.status(200);
                            });
                        });
                    });
                }else{
                    if(errors.length > 0){
                        return res.status(400).json({msg: errors});
                    }
    
                    //update the database
                    conn.query(`INSERT INTO Brands (seller_id,brand_name) VALUES (${userId},${brandName.trim().toLowerCase()})`, function (err, brandRes) {
                        if (err) console.log(err);
    
                        let newUUID = uuid.v4();
                        conn.query(`UPDATE Seller SET store_url=${newUUID},store_slogan=${storeSlogan.trim().toLowerCase()},store_category=${categoryId} WHERE id=${userId}`, function (err, sellerRes) {
                            if (err) console.log(err);
    
                            return res.status(200);
                        });
                    });
                }
            });
        });
    });
    
module.exports = router;
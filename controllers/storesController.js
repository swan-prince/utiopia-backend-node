const express = require('express');
const conn = require('../config/db');
const auth = require('../config/auth')
const router = express.Router();

router.route('/stores')
    .get(auth,(req,res) => {
        conn.connect(function(err) {
            if (err) throw err;

            conn.query(`SELECT * FROM Seller`, function (err, sellerList) {
                if (err) console.log(err);
                let tempList = [];
                sellerList.forEach((seller,idx) => {
                    tempList.push({
                        storeName: seller.storename,
                        storeSlogan: seller.store_slogan,
                        storeUrl: seller.store_url,
                        storeCategory: seller.store_category !== null ? seller.store_category : null
                    });

                    if(idx === sellerList.length - 1){
                        return res.status(200).json(tempList);
                    }
                });

            });

        });
    })
    .get('/:searchText',auth,(req,res) => {
        const {searchText} = req.params;

        conn.connect(function(err) {
            if (err) throw err;

            conn.query(`SELECT * FROM Seller WHERE storename LIKE ${searchText.trim().toLowerCase()}%`, function (err, sellerList) {
                if (err) console.log(err);
                let tempList = [];
                sellerList.forEach((seller,idx) => {
                    tempList.push({
                        storeName: seller.storename,
                        storeSlogan: seller.store_slogan,
                        storeUrl: seller.store_url,
                        storeCategory: seller.store_category !== null ? seller.store_category : null
                    });

                    if(idx === sellerList.length - 1){
                        return res.status(200).json(tempList);
                    }
                });

            });

        });
    });

module.exports = router;
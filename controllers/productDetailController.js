const express = require('express');
const conn = require('../config/db');
const auth = require('../config/auth')
const router = express.Router();

function fetch_data(query) {
    var data = {}
    return new Promise((resolve) => {
        
        conn.connect(function(err){
            if(err) {
                console.log(err);
            }
            conn.query(query, function(err, rows){
                if(err){
                    data = {error: true}
                } else {data
                    data =  {error: false, data: rows}
                }  
                
                resolve(data);
            }); 
    
        })
    })
}

router.get('/:productId',auth, async (req, res) => {
    const productId = parseInt(req.params.productId);
    var product_detail = {};
    var query = `SELECT * FROM product WHERE id=${productId}`;

    var product = await fetch_data(query);
    if (product.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    if (product.data.length === 0)
        return res.status(204).json({msg: "There isn't product."})
    product_detail.product = product.data;

    query = `SELECT * FROM brands WHERE id=${product.data[0].fk_brand_id}`;
    var brands = await fetch_data(query);
    if (brands.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.brands = brands.data;

    query = `SELECT * FROM seller WHERE id=${product.data[0].fk_seller_id}`;
    var seller = await fetch_data(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.seller = seller.data;

    query = `SELECT * FROM category WHERE id=${product.data[0].fk_child_category_id}`;
    var category = await fetch_data(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.category = category.data;
       
    query = `SELECT * FROM product_variant WHERE fk_product_id=${product.data[0].id}`;
    product_variant = await fetch_data(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.product_variant = product_variant.data;
    
    query = `select product_reviews.*, user.first_name, user.last_name from product_reviews, user where product_reviews.fk_product_id=${product.data[0].id} and product_reviews.fk_user_id=user.id`;
    var product_reviews = await fetch_data(query);
    if (product_reviews.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.product_reviews = product_reviews.data;

    return res.status(200).json({product: product_detail});      
});

module.exports = router;
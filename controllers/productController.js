const express = require('express');
const conn = require('../config/db');
const router = express.Router();

function connect_db_func(query) {
    var data = {}
    return new Promise((resolve) => {
        
        conn.connect(function(err){
            if(err) {
                console.log(err);
            }
            conn.query(query, function(err, rows){
                if(err){
                    console.log('err =====>', err)
                    data = {error: true}
                } else {data
                    data =  {error: false, data: rows}
                }  
                
                resolve(data);
            }); 
    
        })
    })
}

router.get('/product-detail/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId);
    var product_detail = {};
    var query = `SELECT * FROM product WHERE id=${productId}`;

    var product = await connect_db_func(query);
    if (product.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    if (product.data.length === 0)
        return res.status(204).json({msg: "There isn't product."})
    product_detail.product = product.data;

    query = `SELECT * FROM brands WHERE id=${product.data[0].fk_brand_id}`;
    var brands = await connect_db_func(query);
    if (brands.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.brands = brands.data;

    query = `SELECT * FROM seller WHERE id=${product.data[0].fk_seller_id}`;
    var seller = await connect_db_func(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.seller = seller.data;

    query = `SELECT * FROM category WHERE id=${product.data[0].fk_child_category_id}`;
    var category = await connect_db_func(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.category = category.data;
       
    query = `SELECT * FROM product_variant WHERE fk_product_id=${product.data[0].id}`;
    product_variant = await connect_db_func(query);
    if (seller.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.product_variant = product_variant.data;
    
    query = `select product_reviews.*, user.first_name, user.last_name from product_reviews, user where product_reviews.fk_product_id=${product.data[0].id} and product_reviews.fk_user_id=user.id`;
    var product_reviews = await connect_db_func(query);
    if (product_reviews.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    product_detail.product_reviews = product_reviews.data;

    return res.status(200).json({product: product_detail});      
});

router.get('/product-search/:searchName', async(req, res) => {
    const searchName = req.params.searchName;
    var search_rows = []
    // var query = `select product.id, product.product_name, product.ratings, product.price, product_variant.discount, product_variant.color, product_variant.picture, brands.brand_name from product, product_variant, brands where product.product_name like '%${searchName}%' and product_variant.fk_product_id=product.id and brands.id=product.fk_brand_id`;
    var query = `select product.product_name, product.ratings, product.price, product_variant.id, product_variant.fk_product_id, product_variant.discount, product_variant.color, product_variant.picture, brands.brand_name from product, product_variant, brands where product.product_name like '%${searchName}%' and product_variant.fk_product_id=product.id and brands.id=product.fk_brand_id`;
    search_rows = await connect_db_func(query);
    if (search_rows.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    
    return res.status(200).json({searchRows: search_rows.data});
});

router.post('/add_cart', async(req, res) => {
    const {user_id, total_cost, quantity, product_variant_id, payment_method} = req.body;    
    var creatioin_date = new Date().toISOString().slice(0, 19).replace('T', ' ').toString();
    var query = `insert into cart (total_cost, fk_user_id, creation_date) values(${total_cost}, ${user_id}, '${creatioin_date}')`;
    var cart = await connect_db_func(query);
    if (cart.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    
    var cartId = cart.data.insertId;
    var query = `insert into line_details (total_cost, quantity, fk_product_variant_id, fk_cart_id) values (${total_cost}, ${quantity}, ${product_variant_id}, ${cartId})`;
    var line_details = await connect_db_func(query);
    if (line_details.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});

    var query = `select * from payment_methods where method_name='${payment_method}'`;
    var payment_method_row = await connect_db_func(query);
    if (payment_method_row.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    var payment_method_id = payment_method_row.data[0].id;
   
    var receiving_date = new Date().toISOString().slice(0, 19).replace('T', ' ').toString();
    var shipment_date = new Date().toISOString().slice(0, 19).replace('T', ' ').toString();
    var expected_delivery_date = new Date().toISOString().slice(0, 19).replace('T', ' ').toString();
    var status = "In process"

    var query = `insert into orders (total_cost, fk_user_id, fk_payment_methods_id, creation_date, receiving_date, shipment_date, expected_delivery_date, fk_cart_id, status) 
                    values(${total_cost}, ${user_id}, ${payment_method_id}, '${creatioin_date}', '${receiving_date}', '${shipment_date}', '${expected_delivery_date}', ${cartId}, '${status}')`
    var orders = await connect_db_func(query);
    if (orders.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});

    return res.status(200).json({msg: "item get added to cart successfully."});
});

router.get('/get_orders/:userId', async(req, res) => {
    const userId = parseInt(req.params.userId);
    var search_rows = []
    
    var query = `select * from orders where fk_user_id=${userId}`;
    order_rows = await connect_db_func(query);
    if (order_rows.error)
        return res.status(500).json({msg: "internal server error please contact our support team."});
    
    return res.status(200).json({searchRows: order_rows.data});
});

module.exports = router;
module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS ProductReviews(id INT NOT NULL AUTO_INCREMENT,product_id INT NOT NULL,\
        user_id INT NULL,order_id INT NULL,ratings DECIMAL(2,1) NULL, review VARCHAR(100),\
        review_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE,\
        FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,\
        FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE);",
    "down": "DROP TABLE ProductReviews;"
}
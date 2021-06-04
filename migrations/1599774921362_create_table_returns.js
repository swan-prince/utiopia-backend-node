module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Returns(id INT NOT NULL AUTO_INCREMENT,user_id INT NOT NULL,\
        seller_id INT NULL,order_id INT NULL,total_cost_return DECIMAL(6,2) NULL,\
        product_name VARCHAR(20) NULL,product_description VARCHAR(50) NULL,method VARCHAR(50) NULL,\
        creation_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        seller_receiving_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        buyer_shipment_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        reason VARCHAR(100) NULL,\
        PRIMARY KEY(id),FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,\
        FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE,\
        FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE);",
    "down": "DROP TABLE Returns;"
}
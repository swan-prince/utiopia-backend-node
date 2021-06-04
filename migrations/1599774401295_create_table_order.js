module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Order(id INT NOT NULL AUTO_INCREMENT,\
        user_id INT NULL,seller_id INT NULL,payment_method_id INT NULL,\
        total_cost DECIMAL(6,2) NULL\
        created_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        receiving_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        shipment_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        expected_delivery_date TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),\
        FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,\
        FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE,\
        FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(id) ON DELETE CASCADE);",
    "down": "DROP TABLE Order;"
}
module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS PaymentMethods(id INT NOT NULL AUTO_INCREMENT,product_id INT NOT NULL,\
        product_name VARCHAR(20) NULL,product_description VARCHAR(50) NULL,method VARCHAR(50) NULL,\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE);",
    "down": "DROP TABLE PaymentMethods;"
}
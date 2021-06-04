module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS ProductVariant(id INT NOT NULL AUTO_INCREMENT,product_id INT NOT NULL,\
        product_name VARCHAR(50) NOT NULL,primary_variant BIT(1) NOT NULL DEFAULT(0),color VARCHAR(20) NULL,\
        size VARCHAR(20) NULL,available_stock INT NULL,sku VARCHAR(50) NULL, picture BLOB NULL, pictureType VARCHAR(20) NULL,\
        discount DECIMAL(6,2) NULL,createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE);",
    "down": "DROP TABLE ProductVariant"
}
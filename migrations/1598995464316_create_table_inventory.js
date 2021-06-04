module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Product(id INT NOT NULL AUTO_INCREMENT,seller_id INT NULL,\
        brand_id INT NULL,child_category_id INT NULL,product_name VARCHAR(20) NOT NULL,\
        price DECIMAL(6,2) NOT NULL,details VARCHAR(100) NULL,product_description VARCHAR(50) NULL,\
        picture BLOB NULL, pictureType VARCHAR(20) NULL,\
        isAvailable BIT(1) NOT NULL DEFAULT(1),ratings VARCHAR(50) NULL,createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE,\
        FOREIGN KEY (brand_id) REFERENCES Brands(id) ON DELETE CASCADE,\
        FOREIGN KEY (child_category_id) REFERENCES Category(id) ON DELETE CASCADE);",
    "down": "DROP TABLE Product;"
}
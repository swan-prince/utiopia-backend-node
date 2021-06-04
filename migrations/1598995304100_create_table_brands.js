module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Brands(id INT NOT NULL AUTO_INCREMENT,seller_id INT NOT NULL,\
        brand_name VARCHAR(20) NULL,\
        brand_description VARCHAR(50) NULL,\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE);",
    "down": "DROP TABLE Brands;"
}
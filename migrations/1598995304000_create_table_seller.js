module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Seller(id INT NOT NULL AUTO_INCREMENT,googleId VARCHAR(150) NULL,\
        facebookId VARCHAR(150) NULL,seller_name VARCHAR(20) NOT NULL,storename VARCHAR(50),store_url VARCHAR(90),\
        store_slogan VARCHAR(100) NULL,store_category VARCHAR(50) NULL,\
        email VARCHAR(200) NOT NULL,password VARCHAR(300) NULL,product_description VARCHAR(300) NULL,\
        addressline1 VARCHAR(50) NOT NULL, addressline2 VARCHAR(50) NULL, zipcode VARCHAR(10) NOT NULL,\
        city VARCHAR(50) NOT NULL, state VARCHAR(50) NULL, country VARCHAR(50) NOT NULL,\
        contact1 VARCHAR(50) NULL, contact2 VARCHAR(50) NULL,\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id));",
    "down": "DROP TABLE Seller;"
}
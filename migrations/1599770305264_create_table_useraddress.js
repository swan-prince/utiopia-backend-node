module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS UserAddress(id INT NOT NULL AUTO_INCREMENT,userId INT NOT NULL,\
        addressLine1 VARCHAR(50) NOT NULL, addressLine2 VARCHAR(50) NULL, zipcode VARCHAR(10) NOT NULL,\
        city VARCHAR(50) NOT NULL, state VARCHAR(50) NOT NULL, country VARCHAR(50) NOT NULL,\
        contact1 VARCHAR(50) NULL, contact2 VARCHAR(50) NULL, is_billing BIT(1) NOT NULL DEFAULT(0),\
        is_shipment BIT(1) NOT NULL DEFAULT(0), email VARCHAR(50),\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE);",
    "down": "DROP TABLE UserAddress;"
}
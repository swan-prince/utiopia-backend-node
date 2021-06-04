module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS OrderStatus(id INT NOT NULL AUTO_INCREMENT,order_id INT NOT NULL,\
        status DECIMAL(6,2) NULL,\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE);",
    "down": "DROP TABLE OrderStatus;"
}
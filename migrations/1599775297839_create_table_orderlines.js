module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS OrderLines(id INT NOT NULL AUTO_INCREMENT,product_variant_id INT NOT NULL,\
        order_id INT NULL,total_cost DECIMAL (6,2) NULL,quantity DECIMAL(6,2),\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (product_variant_id) REFERENCES ProductVariant(id) ON DELETE CASCADE,\
        FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE);",
    "down": "DROP TABLE OrderLines;"
}
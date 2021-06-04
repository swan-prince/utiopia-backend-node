module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS Category(id INT NOT NULL AUTO_INCREMENT,category_name VARCHAR(50) NULL,\
    category_description VARCHAR(50) NULL,parent_category_name VARCHAR(50) NULL,\
    createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
    PRIMARY KEY(id));",
    "down": "DROP TABLE Category;"
}
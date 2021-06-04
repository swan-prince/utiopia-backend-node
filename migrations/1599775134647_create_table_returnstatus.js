module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS ReturnStatus(id INT NOT NULL AUTO_INCREMENT,return_id INT NOT NULL,\
        status DECIMAL(6,2) NULL,\
        createdAt TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP(6)),\
        PRIMARY KEY(id),FOREIGN KEY (return_id) REFERENCES Returns(id) ON DELETE CASCADE);",
    "down": "DROP TABLE ReturnStatus;"
}
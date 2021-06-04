module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Electronic Accessories');",
    "down": "DELETE FROM Category WHERE category_name='Electronic Accessories';"
}
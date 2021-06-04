module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Health & Beauty');",
    "down": "DELETE FROM Category WHERE category_name='Health & Beauty';"
}
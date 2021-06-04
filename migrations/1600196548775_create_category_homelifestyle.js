module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Home & Lifestyle');",
    "down": "DELETE FROM Category WHERE category_name='Home & Lifestyle';"
}
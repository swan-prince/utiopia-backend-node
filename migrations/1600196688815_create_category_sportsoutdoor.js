module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Sports & Outdoor');",
    "down": "DELETE FROM Category WHERE category_name='Sports & Outdoor';"
}
module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Men\'s Fashion');",
    "down": "DELETE FROM Category WHERE category_name='Men\'s Fashion';"
}
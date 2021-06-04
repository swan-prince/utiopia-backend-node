module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Women\'s Fashion');",
    "down": "DELETE FROM Category WHERE category_name='Women\'s Fashion';"
}
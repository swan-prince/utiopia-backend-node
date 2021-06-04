module.exports = {
    "up": "INSERT INTO Category (category_name,parent_category_name) VALUES ('Wearable','Electronic Accessories');",
    "down": "DELETE FROM Category WHERE category_name='Wearable';"
}
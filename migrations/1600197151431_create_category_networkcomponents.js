module.exports = {
    "up": "INSERT INTO Category (category_name,parent_category_name) VALUES ('Network Components','Electronic Accessories');",
    "down": "DELETE FROM Category WHERE category_name='Network Components';"
}
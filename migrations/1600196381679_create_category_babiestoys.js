module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Babies & Toys');",
    "down": "DELETE FROM Category WHERE category_name='Babies & Toys';"
}
module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Groceries & Pets');",
    "down": "DELETE FROM Category WHERE category_name='Groceries & Pets';"
}
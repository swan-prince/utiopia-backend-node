module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Watches, Bags & Jewelry');",
    "down": "DELETE FROM Category WHERE category_name='Watches, Bags & Jewelry';"
}
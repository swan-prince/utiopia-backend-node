module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Automotive & Motorbike');",
    "down": "DELETE FROM Category WHERE category_name='Automotive & Motorbike';"
}
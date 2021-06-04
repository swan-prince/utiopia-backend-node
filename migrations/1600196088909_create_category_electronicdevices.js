module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('Electronic Devices');",
    "down": "DELETE FROM Category WHERE category_name='Electronic Devices';"
}
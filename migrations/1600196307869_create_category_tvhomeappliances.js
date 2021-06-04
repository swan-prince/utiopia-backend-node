module.exports = {
    "up": "INSERT INTO Category (category_name) VALUES ('TV & Home Appliances');",
    "down": "DELETE FROM Category WHERE category_name='TV & Home Appliances';"
}
const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        // Read the token from req cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("You are not logged in. Please Login.")
        }

        // Validate the token
        const decodedObj = jwt.verify(token, "Omkesh@123$Zimpi&Chika")

        // Find the user
        const user = await User.findById(decodedObj._id)

        if (!user) {
            throw new Error("User not found.")
        } else {
            req.user = user;
            next()
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
}

module.exports = { userAuth };
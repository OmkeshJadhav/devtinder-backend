const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        // Read the token from req cookies
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is invalid!")
        }

        // Validate the token
        const decodedObj = jwt.verify(token, "Omkesh@123$Zimpi&Chika")

        // Find the user
        const user = await User.findById(decodedObj._id)

        if (!user) {
            throw new Error("User not found.")
        } else {
            next.user = user;
            next()
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
}

module.exports = { userAuth };
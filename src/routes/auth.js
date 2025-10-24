const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { signUpValidator } = require("../utils/validation.js")
const { userAuth } = require("../middlewares/auth.js")

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body)
        const userObj = user.toObject()

        const requiredFields = ["firstName", "lastName", "emailId", "password", "age"]

        // const areRequiredFieldsAvailable = Object.keys(req.body).every(field => requiredFields.includes(field))
        const areRequiredFieldsAvailable = requiredFields.every(field => userObj[field])

        // Validation of data
        signUpValidator(req)

        if (!areRequiredFieldsAvailable) {
            throw new Error("Sign up failed! Please fill all the required fields.")
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        // Replace the plain password with the hash
        user.password = passwordHash;

        // Save the user
        await user.save();
        res.send("User added successfully!")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credentials! Please enter valid credentials.")
        }

        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            // Create a JWT token
            const token = jwt.sign({ _id: user._id }, "Omkesh@123$Zimpi&Chika", { expiresIn: "1h" })
            console.log("Token generated:")

            // Add the token to cookie and send the response back to the client
            res.cookie("token", token, { expires: new Date(Date.now() + 24 * 3600000) }) // cookie will be removed after 24 hours
            res.send("Login Successful!!!")
        } else {
            throw new Error("Invalid credentials.")
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

authRouter.post("/logout", userAuth, async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).send("Logout successful!");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = authRouter;
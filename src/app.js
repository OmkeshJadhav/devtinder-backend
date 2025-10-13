const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const { signUpValidator } = require("./utils/validation.js")

const app = express()
const PORT = 7878

app.use(express.json())

app.post("/signup", async (req, res) => {
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

app.get("/user", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId })
        res.send(user)
    } catch (error) {
        res.status(400).send({ message: error.message }, { error: error.message })
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send({ message: "Something went wrong" }, { error: error.message })
    }
})

app.get("/findUserById", async (req, res) => {
    try {
        const users = await User.findById({ _id: req.body._id })
        res.send(users)
    } catch (error) {
        res.status(400).send({ message: "Something went wrong" }, { error: error.message })
    }
})

app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId

        // Step 1: Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send(`Invalid user id: ${userId}`)
        }

        // Step 2: Proceed with deletion
        const user = await User.findByIdAndDelete(userId)

        if (!user) {
            return res.status(404).send(`No user found with the id ${userId}`)
        }

        res.send("User deleted successfully.")
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Something went wrong", error: error.message })
    }
})

app.patch("/user/:userId", async (req, res) => {
    const data = req.body;
    const userId = req.params.userId

    try {
        const allowed_Updates = ["password", "image", "assets"]
        const isUpdateAllowed = Object.keys(data).every(key => allowed_Updates.includes(key))

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed")
        } else if (data.skills.length > 5) {
            throw new Error("You can enter max 5 skills")
        }
        else {
            const user = await User.findByIdAndUpdate(userId, data, { runValidators: true });
            res.send(`User data for id ${userId} updated successfully!!`)
        }

    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error: error.message })
    }
})

connectDB()
    .then(() => {
        console.log("DB connection succesfully established !!!");
        app.listen(PORT, () => {
            console.log(`Server is succefully listening on port ${PORT}`);
        })
    })
    .catch(() => {
        console.log("DB connection failed!!!");
    })
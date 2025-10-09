const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()
const PORT = 7878

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.send("User added successfully!")
    } catch (error) {
        res.status(400).send({message: "Something went wrong"}, {error: error.message})
    }
})

app.get("/user", async(req, res) => {
    try {
        const user = await User.findOne({emailId: req.body.emailId})
        res.send(user)
    } catch (error) {
        res.status(400).send({message: "Something went wrong"}, {error: error.message})
    }
})

app.get("/feed", async(req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send({message: "Something went wrong"}, {error: error.message})
    }
})

app.get("/findUserById", async(req, res) => {
    try {
        const users = await User.findById({_id: req.body._id})
        res.send(users)
    } catch (error) {
        res.status(400).send({message: "Something went wrong"}, {error: error.message})
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
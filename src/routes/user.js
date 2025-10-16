const express = require("express")
const User = require("../models/user")
const mongoose = require("mongoose")
const { userAuth } = require("../middlewares/auth")

const userRouter = express.Router()

userRouter.get("/user", userAuth, async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId })
        res.send(user)
    } catch (error) {
        res.status(400).send({ message: error.message }, { error: error.message })
    }
})

userRouter.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send({ message: "Something went wrong" }, { error: error.message })
    }
})

userRouter.delete("/user", userAuth, async (req, res) => {
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

module.exports = userRouter;
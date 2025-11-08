const express = require("express")
const User = require("../models/user")
const mongoose = require("mongoose")
const { userAuth } = require("../middlewares/auth")
const connectionRequest = require("../models/connectionRequest")

const userRouter = express.Router()

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "birthDate", "age", "image", "skills"])

        res.json({
            message: "Connection Requests fetched successfully.",
            data: connectionRequests
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser, status: "accepted" },
                { toUserId: loggedInUser, status: "accepted" }
            ]
        })
            .populate("fromUserId", ["firstName", "lastName", "birthDate", "age", "image", "skills"])
            .populate("toUserId", ["firstName", "lastName", "birthDate", "age", "image", "skills"])

        const data = connectionRequests.map(connection => {
            const fromUser = connection.fromUserId;
            const toUser = connection.toUserId;

            if (!fromUser || !toUser) {
                console.warn("Skipping connection with missing user:", connection._id);
                return null;
            }

            if (fromUser._id.toString() === loggedInUser._id.toString()) {
                return toUser;
            }
            return fromUser;
        })
            .filter(user => user !== null);

        res.json({ data: data })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit

        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()

        connectionRequests.map(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select("firstName lastName birthDate age image skills")
            .skip(skip)
            .limit(limit)

        res.send(users)
    } catch (error) {
        res.status(400).send({ error: error.message })
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
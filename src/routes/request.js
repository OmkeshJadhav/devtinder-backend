const express = require("express")
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest")

const connectionRequestRouter = express.Router()

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ error: `Status "${status}" is not permitted` });
        }

        const doesReceiverUserExists = await User.findOne({ _id: toUserId })
        if(!doesReceiverUserExists){
            throw new Error(`Receiver profile does not exists.`)
        }

        const doesRequestExists = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(doesRequestExists){
            return res.status(400).json({error: `Connection request already exists.`})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const connectionRequestData = await connectionRequest.save()

        res.json({
            message: "Connection request sent successfully!",
            data: connectionRequestData
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = connectionRequestRouter;

/*
1) If you don’t want users sending requests to themselves:
    if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ error: "Cannot send request to yourself." });
    }

2) Validate status value before creating document - Even though you have enum validation in Mongoose, it’s good to check early to send cleaner error responses:
    const allowedStatus = ["interested", "ignored", "accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid status type!" });
    }

3) To prevent duplicate requests - handle the duplicate key error (code 11000):
    if (error.code === 11000) {
        res.status(400).json({ error: "Connection request already exists." });
    }
*/
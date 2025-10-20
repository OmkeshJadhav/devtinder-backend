const mongoose = require("mongoose")

const connectionRequest = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type.`
            }
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("ConnectionRequest", connectionRequest)

/*
1) Add ref for relational clarity
- If fromUserId and toUserId refer to documents in a User collection, add ref: "User":
- This helps when using .populate() to fetch user details in queries.

2) Add a unique index
- To prevent duplicate connection requests between the same two users:
- This ensures a user can’t send multiple requests to the same person.

*/
const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
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

// unique index
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})
// 1 is ascending order, -1 means descending order

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        const err = new Error("You cannot send request to yourself");
        return next(err);
    }
    next()
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)

/*
1) Add ref for relational clarity
- If fromUserId and toUserId refer to documents in a User collection, add ref: "User":
- This helps when using .populate() to fetch user details in queries.

2) Add a unique index
- To prevent duplicate connection requests between the same two users:
- This ensures a user can’t send multiple requests to the same person.

*/
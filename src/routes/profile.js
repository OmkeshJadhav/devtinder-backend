const express = require("express")
const { userAuth } = require("../middlewares/auth")


const profileRouter = express.Router()

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

profileRouter.patch("/profile/:userId", userAuth, async (req, res) => {
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

module.exports = profileRouter;
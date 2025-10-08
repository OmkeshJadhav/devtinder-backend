const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()
const PORT = 7878

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Suresh",
        lastName: "Gavit",
        age: 31,
        gender: "Male",
        emailId: "suresh.gavit@gmail.com",
        password: "Suresh@123"
    })

    try {
        await user.save()
        res.send("User added successfully!")
    } catch (error) {
        res.status(400).send("Error saving the user", err.message)
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
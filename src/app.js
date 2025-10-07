const express = require("express")
const { adminAuth, userAuth } = require("./middlewares/auth")

const app = express()
const PORT = 7878

app.get("/user/getUserData", (req, res, next) => {
    console.log("Inside /user/getUserData route")
    // Logic to make DB call and get user data
    const err = new Error("Database connection failed!")
    next(err) // Pass error to Express error-handling middleware
})

// Error-handling middleware (specific to "/user" routes)
app.use("/user", (err, req, res, next) => {
    console.error("Error logged:", err.message)
    res.status(500).send("Something went wrong.")
})

app.listen(PORT, (req, res) => {
    console.log("Server is listening successfully!!!");
})


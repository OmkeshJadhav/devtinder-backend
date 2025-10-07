const express = require("express")
const {adminAuth, userAuth} = require("./middlewares/auth")

const app = express()
const PORT = 7878

app.use("/admin", adminAuth)

app.get("/admin/getAllUsersData", (req, res) => {
    res.send("Received all users data")
})

app.post("/admin/deleteUser", (req, res) => {
    res.send("User deleted successfully")
})

app.post("/user/login", (req, res)=>{
    res.send("User logged in successfully!")
})

app.get("/user/data", userAuth, (req, res) => { // userAuth is directly applied here
    res.send("User data sent")
})

app.listen(PORT, (req, res) => {
    console.log("Server is listening successfully!!!");
})
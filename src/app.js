const express = require("express")
const app = express()
const PORT = 7878

app.use("/home", (req, res) => {
    res.send("Namaste Home page")
})
app.use("/connections",(req, res) => {
    res.send("Connections page")
})
app.use("/profile", (req, res) => {
    res.send("See your profile")
})

app.use("/hello", (req, res) => {
    res.send("Helllooooo!!!!!")
})

app.listen(PORT, (req, res) => {
    console.log("Server is listening successfully!!!");
})
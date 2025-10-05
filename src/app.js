const express = require("express")
const app = express()
const PORT = 7878

app.get("/user", (req, res) => {
    console.log("GET user data");
    res.send("User data received successfully.")
})
app.post("/user", (req, res) => {
    console.log("Update user data");
    res.send("New user data added successfully.")
})
app.patch("/user", (req, res) => {
    console.log("Update user data");
    res.send("User data updated successfully.")
})
app.delete("/user", (req, res) => {
    console.log("Delete user data");
    res.send("User data deleted successfully.")
})

app.listen(PORT, (req, res) => {
    console.log("Server is listening successfully!!!");
})
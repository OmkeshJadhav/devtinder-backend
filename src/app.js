const express = require("express")
const app = express()
const PORT = 7878

app.get("/user", (req, res) => {
    console.log("GET user data");
    console.log(req.query)
    res.send("User data received successfully.")
})

app.get("/user/:userId/:name", (req, res) => {
    console.log("GET user data");
    console.log(req.params)
    res.send("User data received successfully.")
})

app.get(/^\/a(bc)?d$/, (req, res) => {
    res.send({ firstName: "Omkesh", lastName: "Jadhav" });
});

app.post("/user", (req, res) => {
    console.log("Update user data");
    res.send("New user created successfully")
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
const express = require("express")
const app = express()
const PORT = 7878

const rh1 = (req, res, next) => {
    console.log("Handling the route Omkesh")
    res.send("1 Handling omkesh route")
    next()
}

const rh2 = (req, res, next) => {
    console.log("2 Handling omkesh route");
    res.send("2 Handling omkesh route")
    next()
}

const rh3 = (req, res, next) => {
    console.log("3 Handling omkesh route");
    res.send("3 Handling omkesh route")
}

app.use("/omkesh", [rh1, rh2, rh3])


app.get("/user", (req, res, next) => {
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
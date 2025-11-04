const express = require("express")
const connectDB = require("./config/database.js")
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express()
const PORT = 7878

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());

const authRouter = require("../src/routes/auth.js")
const profileRouter = require("../src/routes/profile.js")
const userRouter = require("../src/routes/user.js");
const connectionRequestRouter = require("./routes/request.js");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", userRouter)
app.use("/", connectionRequestRouter)

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
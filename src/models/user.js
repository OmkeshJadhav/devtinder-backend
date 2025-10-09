const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, min:18, max: 60},
    gender: {type: String, enum: ['Male', 'Female', 'Other']},
    emailId: {type: String, required: true, unique: true},
    password: {type: String}
})

module.exports = mongoose.model("User", userSchema)
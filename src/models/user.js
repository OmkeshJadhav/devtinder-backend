const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 40
    },
    lastName: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 40
    },
    birthDate: {
        type: Date,
        default: Date.now()
    },
    age: {
        type: Number, 
        min:18, 
        max: 65
    },
    gender: {
        type: String, 
        enum: ['Male', 'Female', 'Other']
    },
    emailId: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://www.shutterstock.com/search/blank-passport-photo"
    },
    assets: {
        type: String,
        validate: function(value){
            if(!["Stocks", "Mutual Funds", "Cryptos"].includes(value)) {
                throw new Error("Assets data is not valid!!!")
            }
        }
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)
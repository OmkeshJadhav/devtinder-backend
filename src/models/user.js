const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40,
        index: true
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
        min: 18,
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
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter valid email id")
            };
        }
    },
    password: {
        type: String,
        trim: true,
        validate: (value) => {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Your password is not strong")
            }
        }
    },
    image: {
        type: String,
        default: "https://www.shutterstock.com/search/blank-passport-photo",
        validate: (value) => {
            if (!validator.isURL(value)) {
                throw new Error("Please enter valid link for image")
            }
        }
    },
    assets: {
        type: String,
        validate: function (value) {
            if (!["Stocks", "Mutual Funds", "Cryptos"].includes(value)) {
                throw new Error("Assets data is not valid!!!")
            }
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

userSchema.index({firstName: 1, lastName: 1})

// For Creating JWT
userSchema.methods.createJWT = async function(){
    const user = this;
    
    const token = jwt.sign({_id: user._id}, "Omkesh@123$Zimpi&Chika", {expiresIn: "1h"})

    return token;
}

// For Password validation
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)
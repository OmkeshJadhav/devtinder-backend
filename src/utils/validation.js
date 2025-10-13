const validator = require("validator")

const signUpValidator = (req) => {
    const { firstName, lastName, emailId, password, age, gender, image, skills } = req.body

    if (!firstName || !lastName) {
        throw new Error("Please enter valid first and last name")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid email id.")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password.")
    } else if (skills.length > 5) {
        throw new Error("You can enter max 5 skills")
    }
}

module.exports = { signUpValidator }
const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://admin:admin123@democluster.xv0gtvo.mongodb.net/")
}

module.exports = connectDB;



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["customer", "agent", "admin"],
        default: "customer"
    },

    department: {
        type: String,
        enum: [
            "IT Support",
            "Billing Support",
            "Account Support",
            "General Support"
        ],
        default: "General Support"
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
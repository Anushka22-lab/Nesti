const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },

        status: {
            type: String,
            enum: ["open", "in-progress", "resolved", "closed"],
            default: "open"
        },

        category: {
            type: String,
            enum: ["technical", "billing", "account", "general"],
            default: "general"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        aiAnalysis: {
            category: {
                type: String
            },

            priority: {
                type: String
            },

            intent: {
                type: String
            },

            summary: {
                type: String
            },

            suggestedDepartment: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);

const ticketModel = mongoose.model("Ticket", ticketSchema);

module.exports = ticketModel;
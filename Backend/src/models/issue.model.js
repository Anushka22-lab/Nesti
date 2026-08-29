const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        // ========================================
        // NORMALIZED ISSUE IDENTIFIER
        // ========================================

        issueKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        // ========================================
        // HUMAN READABLE ISSUE NAME
        // ========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        // ========================================
        // AI GENERATED DESCRIPTION
        // ========================================

        description: {
            type: String,
            default: ""
        },

        // ========================================
        // ISSUE CATEGORY
        // ========================================

        category: {
            type: String,
            enum: [
                "technical",
                "billing",
                "account",
                "general"
            ],
            default: "general"
        },

        // ========================================
        // SUGGESTED DEPARTMENT
        // ========================================

        department: {
            type: String,
            default: ""
        },

        // ========================================
        // TOTAL TICKETS
        // ========================================

        ticketCount: {
            type: Number,
            default: 0
        },

        // ========================================
        // FIRST / LAST DETECTION
        // ========================================

        firstDetectedAt: {
            type: Date,
            default: Date.now
        },

        lastDetectedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// ========================================
// MODEL
// ========================================

const issueModel =
    mongoose.model("Issue", issueSchema);


module.exports = issueModel;
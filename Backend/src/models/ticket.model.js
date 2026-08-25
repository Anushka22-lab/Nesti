const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        // ========================================
        // BASIC TICKET INFO
        // ========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },


        // ========================================
        // TICKET STATUS
        // ========================================

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "urgent"
            ],
            default: "medium"
        },

        status: {
            type: String,
            enum: [
                "open",
                "in-progress",
                "resolved",
                "closed"
            ],
            default: "open"
        },


        // ========================================
        // CATEGORY
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
        // CUSTOMER
        // ========================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ========================================
        // ASSIGNED AGENT
        // ========================================

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ========================================
        // AI ANALYSIS
        // ========================================

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

        },


        // ========================================
        // COMMENTS / REPLIES
        // ========================================

        comments: [

            {

                message: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 2000
                },

                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                authorRole: {
                    type: String,
                    enum: [
                        "customer",
                        "agent",
                        "admin"
                    ],
                    required: true
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }

            }

        ]

    },

    {
        timestamps: true
    }

);


const ticketModel =
    mongoose.model(
        "Ticket",
        ticketSchema
    );


module.exports = ticketModel;
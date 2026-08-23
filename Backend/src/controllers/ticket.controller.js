const ticketModel = require("../models/ticket.model");

const {
    findAgentForTicket
} = require("../services/assignment.service");

const {
    analyzeTicket
} = require("../services/ai.service");

const {
    assignAgent
} = require("../services/assignment.service");

const userModel = require("../models/user.model");


// ========================================
// CREATE TICKET
// ========================================

const createTicket = async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;


        // STEP 1: AI analyzes ticket

        const aiResult =
            await analyzeTicket(
                title,
                description
            );


        // STEP 2: Find suitable agent

        const agent =
            await findAgentForTicket(
                aiResult.suggestedDepartment
            );


        // STEP 3: Create ticket

        const ticket =
            await ticketModel.create({

                title,

                description,

                priority:
                    aiResult.priority,

                category:
                    aiResult.category,

                aiAnalysis: {

                    category:
                        aiResult.category,

                    priority:
                        aiResult.priority,

                    intent:
                        aiResult.intent,

                    summary:
                        aiResult.summary,

                    suggestedDepartment:
                        aiResult.suggestedDepartment

                },

                createdBy:
                    req.user.id,

                assignedTo:
                    agent
                        ? agent._id
                        : null

            });


        return res.status(201).json({

            success: true,

            message:
                "Ticket created successfully",

            ticket,

            aiAnalysis:
                aiResult,

            assignedAgent:
                agent
                    ? {

                        id:
                            agent._id,

                        name:
                            agent.name,

                        department:
                            agent.department

                    }
                    : null

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// GET MY TICKETS
// ========================================

const getMyTickets = async (req, res) => {
    try {

        const tickets = await ticketModel
            .find({
                createdBy: req.user.id
            })
            .populate(
                "assignedTo",
                "name email department"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            tickets
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ========================================
// GET TICKET BY ID
// ========================================

const getTicketById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const ticket =
            await ticketModel
                .findById(id)
                .populate(
                    "createdBy",
                    "name email"
                )
                .populate(
                    "assignedTo",
                    "name email department"
                );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        return res.status(200).json({

            success: true,

            ticket

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// GET ALL TICKETS - ADMIN
// ========================================

const getAllTickets = async (req, res) => {

    try {

        const tickets =
            await ticketModel
                .find()
                .populate(
                    "createdBy",
                    "name email"
                )
                .populate(
                    "assignedTo",
                    "name email department"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            tickets

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// ASSIGN TICKET - ADMIN
// ========================================

const assignTicket = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // ====================================
        // FIND NEHA DIRECTLY FROM DATABASE
        // ====================================

        const agent =
            await userModel.findOne({

                email:
                    "neha@nesti.com",

                role:
                    "agent"

            });


        if (!agent) {

            return res.status(404).json({

                success: false,

                message:
                    "Neha agent not found"

            });

        }


        // ====================================
        // ASSIGN REAL MONGODB _ID
        // ====================================

        const ticket =
            await ticketModel.findByIdAndUpdate(

                id,

                {
                    assignedTo:
                        agent._id
                },

                {
                    new: true
                }

            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "assignedTo",
                "name email department"
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Ticket assigned successfully",

            ticket

        });


    } catch (error) {

        console.log(
            "ASSIGN TICKET ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// UPDATE TICKET STATUS - ADMIN
// ========================================

const updateTicketStatus = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const {
            status
        } = req.body;


        const allowedStatuses = [

            "open",

            "in-progress",

            "resolved"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid status"

            });

        }


        const ticket =
            await ticketModel.findByIdAndUpdate(

                id,

                {
                    status:
                        status
                },

                {
                    new: true,

                    runValidators: true
                }

            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Ticket status updated successfully",

            ticket

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


module.exports = {

    createTicket,

    getMyTickets,

    getTicketById,

    getAllTickets,

    assignTicket,

    updateTicketStatus

};
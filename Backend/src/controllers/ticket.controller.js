const mongoose = require("mongoose");

const ticketModel = require("../models/ticket.model");
const userModel = require("../models/user.model");

const {
    findAgentForTicket
} = require("../services/assignment.service");

const {
    analyzeTicket
} = require("../services/ai.service");

const {
    getIO
} = require("../services/socket.service");


// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


const populateTicket = (query) => {

    return query
        .populate(
            "createdBy",
            "name email role"
        )
        .populate(
            "assignedTo",
            "name email department role"
        )
        .populate(
            "comments.author",
            "name email role"
        );

};


const canAccessTicket = (ticket, user) => {

    if (!ticket || !user) {
        return false;
    }

    const userId =
        user.id.toString();

    const isCustomer =
        ticket.createdBy &&
        ticket.createdBy.toString() === userId;

    const isAssignedAgent =
        ticket.assignedTo &&
        ticket.assignedTo.toString() === userId;

    const isAdmin =
        user.role === "admin";

    return (
        isCustomer ||
        isAssignedAgent ||
        isAdmin
    );

};


// ======================================================
// CREATE TICKET
// ======================================================

const createTicket = async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;


        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (
            !title ||
            !title.trim() ||
            !description ||
            !description.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Title and description are required"

            });

        }


        // ----------------------------------------------
        // AI ANALYSIS
        // ----------------------------------------------

        const aiResult =
            await analyzeTicket(
                title.trim(),
                description.trim()
            );


        // ----------------------------------------------
        // AUTO ASSIGN AGENT
        // ----------------------------------------------

        const agent =
            await findAgentForTicket(
                aiResult.suggestedDepartment
            );


        // ----------------------------------------------
        // CREATE TICKET
        // ----------------------------------------------

        const ticket =
            await ticketModel.create({

                title:
                    title.trim(),

                description:
                    description.trim(),

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


        // ----------------------------------------------
        // POPULATE
        // ----------------------------------------------

        const populatedTicket =
            await populateTicket(
                ticketModel.findById(
                    ticket._id
                )
            );


        // ----------------------------------------------
        // REAL-TIME TICKET CREATED
        // ----------------------------------------------

        try {

            const io = getIO();


            io.to(
                `user_${req.user.id}`
            ).emit(
                "ticketCreated",
                {
                    ticket:
                        populatedTicket
                }
            );


            if (agent) {

                io.to(
                    `user_${agent._id}`
                ).emit(
                    "ticketCreated",
                    {
                        ticket:
                            populatedTicket
                    }
                );

            }

        } catch (socketError) {

            console.error(
                "CREATE TICKET SOCKET ERROR:",
                socketError.message
            );

        }


        return res.status(201).json({

            success: true,

            message:
                "Ticket created successfully",

            ticket:
                populatedTicket,

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

        console.error(
            "CREATE TICKET ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET MY TICKETS - CUSTOMER
// ======================================================

const getMyTickets = async (req, res) => {

    try {

        const tickets =
            await populateTicket(

                ticketModel.find({
                    createdBy:
                        req.user.id
                })

            ).sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            tickets

        });


    } catch (error) {

        console.error(
            "GET MY TICKETS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET ONE TICKET
// ======================================================

const getTicketById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ticket ID"

            });

        }


        const ticket =
            await populateTicket(

                ticketModel.findById(id)

            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        if (
            !canAccessTicket(
                ticket,
                req.user
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have access to this ticket"

            });

        }


        return res.status(200).json({

            success: true,

            ticket

        });


    } catch (error) {

        console.error(
            "GET TICKET ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET ALL TICKETS - ADMIN
// ======================================================

const getAllTickets = async (req, res) => {

    try {

        const tickets =
            await populateTicket(
                ticketModel.find()
            ).sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            tickets

        });


    } catch (error) {

        console.error(
            "GET ALL TICKETS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// ADMIN ANALYTICS
// ======================================================

const getTicketAnalytics = async (req, res) => {

    try {

        const [

            totalTickets,

            openTickets,

            inProgressTickets,

            resolvedTickets

        ] = await Promise.all([

            ticketModel.countDocuments(),

            ticketModel.countDocuments({
                status: "open"
            }),

            ticketModel.countDocuments({
                status: "in-progress"
            }),

            ticketModel.countDocuments({
                status: "resolved"
            })

        ]);


        // ----------------------------------------------
        // PRIORITY STATS
        // ----------------------------------------------

        const priorityStats =
            await ticketModel.aggregate([

                {
                    $group: {

                        _id:
                            "$priority",

                        count: {
                            $sum: 1
                        }

                    }
                },

                {
                    $sort: {
                        count: -1
                    }
                }

            ]);


        // ----------------------------------------------
        // CATEGORY STATS
        // ----------------------------------------------

        const categoryStats =
            await ticketModel.aggregate([

                {
                    $group: {

                        _id:
                            "$category",

                        count: {
                            $sum: 1
                        }

                    }
                },

                {
                    $sort: {
                        count: -1
                    }
                }

            ]);


        // ----------------------------------------------
        // AGENT WORKLOAD
        // ----------------------------------------------

        const agentWorkload =
            await ticketModel.aggregate([

                {
                    $match: {

                        assignedTo: {
                            $ne: null
                        }

                    }

                },

                {
                    $group: {

                        _id:
                            "$assignedTo",

                        totalTickets: {
                            $sum: 1
                        },

                        activeTickets: {

                            $sum: {

                                $cond: [

                                    {
                                        $ne: [
                                            "$status",
                                            "resolved"
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        },

                        resolvedTickets: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            "resolved"
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        }

                    }

                },

                {
                    $lookup: {

                        from:
                            "users",

                        localField:
                            "_id",

                        foreignField:
                            "_id",

                        as:
                            "agent"

                    }

                },

                {
                    $unwind:
                        "$agent"
                },

                {
                    $project: {

                        _id:
                            0,

                        agentId:
                            "$agent._id",

                        name:
                            "$agent.name",

                        email:
                            "$agent.email",

                        department:
                            "$agent.department",

                        totalTickets:
                            1,

                        activeTickets:
                            1,

                        resolvedTickets:
                            1

                    }

                },

                {
                    $sort: {

                        activeTickets:
                            -1,

                        totalTickets:
                            -1

                    }

                }

            ]);


        return res.status(200).json({

            success: true,

            stats: {

                totalTickets,

                openTickets,

                inProgressTickets,

                resolvedTickets

            },

            priorityStats,

            categoryStats,

            agentWorkload

        });


    } catch (error) {

        console.error(
            "ANALYTICS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// ASSIGN TICKET - ADMIN
// ======================================================

const assignTicket = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const {
            agentId
        } = req.body;


        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ticket ID"

            });

        }


        if (
            !agentId ||
            !isValidObjectId(agentId)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid agentId is required"

            });

        }


        const agent =
            await userModel.findOne({

                _id:
                    agentId,

                role:
                    "agent"

            });


        if (!agent) {

            return res.status(404).json({

                success: false,

                message:
                    "Agent not found"

            });

        }


        const ticket =
            await ticketModel.findByIdAndUpdate(

                id,

                {
                    assignedTo:
                        agent._id
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


        const populatedTicket =
            await populateTicket(
                ticketModel.findById(id)
            );


        // ----------------------------------------------
        // REAL-TIME ASSIGNMENT UPDATE
        // ----------------------------------------------

        try {

            const io = getIO();


            io.to(
                `ticket_${id}`
            ).emit(
                "ticketAssignmentUpdated",
                {
                    ticketId:
                        id,

                    assignedTo:
                        populatedTicket.assignedTo
                }
            );


            io.to(
                `user_${agent._id}`
            ).emit(
                "ticketAssignmentUpdated",
                {
                    ticketId:
                        id,

                    assignedTo:
                        populatedTicket.assignedTo
                }
            );

        } catch (socketError) {

            console.error(
                "ASSIGNMENT SOCKET ERROR:",
                socketError.message
            );

        }


        return res.status(200).json({

            success: true,

            message:
                "Ticket assigned successfully",

            ticket:
                populatedTicket

        });


    } catch (error) {

        console.error(
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


// ======================================================
// UPDATE TICKET STATUS - ADMIN
// ======================================================

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


        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ticket ID"

            });

        }


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


        // ----------------------------------------------
        // REAL-TIME STATUS UPDATE
        // ----------------------------------------------

        try {

            const io = getIO();


            io.to(
                `ticket_${id}`
            ).emit(
                "ticketStatusUpdated",
                {
                    ticketId:
                        id,

                    status:
                        ticket.status,

                    updatedBy:
                        req.user.id
                }
            );

        } catch (socketError) {

            console.error(
                "STATUS SOCKET ERROR:",
                socketError.message
            );

        }


        return res.status(200).json({

            success: true,

            message:
                "Ticket status updated successfully",

            ticket

        });


    } catch (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// ADD COMMENT / REPLY
// CUSTOMER <-> AGENT <-> ADMIN
// ======================================================

const addTicketComment = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const {
            message
        } = req.body;


        // ----------------------------------------------
        // VALIDATE TICKET ID
        // ----------------------------------------------

        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ticket ID"

            });

        }


        // ----------------------------------------------
        // VALIDATE MESSAGE
        // ----------------------------------------------

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Message cannot be empty"

            });

        }


        const cleanMessage =
            message.trim();


        // ----------------------------------------------
        // FIND TICKET
        // ----------------------------------------------

        const ticket =
            await ticketModel.findById(id);


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        // ----------------------------------------------
        // ACCESS CONTROL
        // ----------------------------------------------

        if (
            !canAccessTicket(
                ticket,
                req.user
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have access to this ticket"

            });

        }


        // ----------------------------------------------
        // ADD COMMENT
        // ----------------------------------------------

        ticket.comments.push({

            message:
                cleanMessage,

            author:
                req.user.id,

            authorRole:
                req.user.role

        });


        await ticket.save();


        // ----------------------------------------------
        // POPULATE NEW COMMENT AUTHOR
        // ----------------------------------------------

        await ticket.populate(
            "comments.author",
            "name email role"
        );


        const comment =
            ticket.comments[
                ticket.comments.length - 1
            ];


        // ----------------------------------------------
        // REAL-TIME COMMENT EVENT
        // ----------------------------------------------

        try {

            const io = getIO();


            io.to(
                `ticket_${id}`
            ).emit(
                "ticketCommentAdded",
                {
                    ticketId:
                        id,

                    comment
                }
            );


        } catch (socketError) {

            console.error(
                "COMMENT SOCKET ERROR:",
                socketError.message
            );

        }


        // ----------------------------------------------
        // RESPONSE
        // ----------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Comment added successfully",

            comment

        });


    } catch (error) {

        console.error(
            "ADD COMMENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    createTicket,

    getMyTickets,

    getTicketById,

    getAllTickets,

    getTicketAnalytics,

    assignTicket,

    updateTicketStatus,

    addTicketComment

};
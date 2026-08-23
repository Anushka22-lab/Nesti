const ticketModel = require("../models/ticket.model");
const userModel = require("../models/user.model");

const {
    getIO
} = require("../services/socket.service");


// ========================================
// GET ALL AGENTS
// ========================================

const getAllAgents = async (req, res) => {

    try {

        const agents = await userModel
            .find({
                role: "agent"
            })
            .select(
                "name email department"
            )
            .sort({
                name: 1
            });


        return res.status(200).json({

            success: true,

            agents

        });


    } catch (error) {

        console.log(
            "GET AGENTS ERROR:",
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
// GET MY ASSIGNED TICKETS
// ========================================

const getMyAssignedTickets = async (req, res) => {

    try {

        const tickets =
            await ticketModel

                .find({
                    assignedTo:
                        req.user.id
                })

                .populate(
                    "createdBy",
                    "name email"
                )

                .populate(
                    "assignedTo",
                    "name email department"
                );


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
// GET ONE ASSIGNED TICKET
// ========================================

const getAssignedTicketById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const ticket =
            await ticketModel

                .findOne({

                    _id: id,

                    assignedTo:
                        req.user.id

                })

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
                    "Ticket not found or not assigned to you"

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
// UPDATE ASSIGNED TICKET STATUS
// ========================================

const updateAssignedTicketStatus = async (req, res) => {

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
            await ticketModel.findOneAndUpdate(

                {

                    _id: id,

                    assignedTo:
                        req.user.id

                },

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
                    "Ticket not found or not assigned to you"

            });

        }


        // ====================================
        // SOCKET.IO
        // ====================================

        const io = getIO();


        io.to(`ticket_${id}`).emit(

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


// ========================================
// EXPORTS
// ========================================

module.exports = {

    getAllAgents,

    getMyAssignedTickets,

    getAssignedTicketById,

    updateAssignedTicketStatus

};
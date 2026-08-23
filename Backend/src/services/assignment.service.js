const userModel = require("../models/user.model");
const ticketModel = require("../models/ticket.model");


// ========================================
// FIND BEST AGENT FOR TICKET
// ========================================
//
// Instead of always selecting the first agent,
// we select the agent having the FEWEST
// currently assigned tickets.
//
// Example:
//
// Aman  -> 2 tickets
// Neha  -> 5 tickets
// Priya -> 1 ticket
// Rahul -> 3 tickets
//
// New ticket -> Priya
//
// ========================================

const findAgentForTicket = async (department) => {

    try {

        // ====================================
        // STEP 1
        // FIND AGENTS
        // ====================================

        let agents = await userModel
            .find({
                role: "agent",
                department: department
            })
            .select("_id name email department");


        // ====================================
        // STEP 2
        // IF NO AGENT IN THAT DEPARTMENT
        // USE ANY AVAILABLE AGENT
        // ====================================

        if (agents.length === 0) {

            agents = await userModel
                .find({
                    role: "agent"
                })
                .select("_id name email department");

        }


        // ====================================
        // STEP 3
        // NO AGENTS AVAILABLE
        // ====================================

        if (agents.length === 0) {

            return null;

        }


        // ====================================
        // STEP 4
        // FIND AGENT WITH FEWEST TICKETS
        // ====================================

        let selectedAgent = null;

        let lowestTicketCount = Infinity;


        for (const agent of agents) {

            const ticketCount =
                await ticketModel.countDocuments({

                    assignedTo: agent._id,

                    status: {
                        $ne: "resolved"
                    }

                });


            console.log(
                `${agent.name}: ${ticketCount} active tickets`
            );


            if (
                ticketCount <
                lowestTicketCount
            ) {

                lowestTicketCount =
                    ticketCount;

                selectedAgent =
                    agent;

            }

        }


        // ====================================
        // STEP 5
        // RETURN SELECTED AGENT
        // ====================================

        console.log(
            "AUTO ASSIGNED AGENT:",
            selectedAgent?.name
        );


        return selectedAgent;


    } catch (error) {

        console.log(
            "FIND AGENT ERROR:",
            error
        );

        throw error;

    }

};


// ========================================
// MANUAL ASSIGNMENT
// ========================================

const assignAgent = async (
    ticketId,
    agentId
) => {

    try {

        const ticket =
            await ticketModel.findByIdAndUpdate(

                ticketId,

                {
                    assignedTo: agentId
                },

                {
                    new: true
                }

            );


        return ticket;

    } catch (error) {

        console.log(
            "ASSIGN AGENT ERROR:",
            error
        );

        throw error;

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    findAgentForTicket,

    assignAgent

};
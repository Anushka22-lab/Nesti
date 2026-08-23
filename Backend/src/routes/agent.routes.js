const express = require("express");

const {

    getAllAgents,

    getMyAssignedTickets,

    getAssignedTicketById,

    updateAssignedTicketStatus

} = require("../controllers/agent.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");

const authorizeRoles =
    require("../middlewares/authorize.middleware");


const router = express.Router();


// ========================================
// ADMIN - GET ALL AGENTS
// ========================================

router.get(

    "/agents",

    authMiddleware,

    authorizeRoles("admin"),

    getAllAgents

);


// ========================================
// AGENT - GET MY TICKETS
// ========================================

router.get(

    "/tickets",

    authMiddleware,

    authorizeRoles("agent"),

    getMyAssignedTickets

);


// ========================================
// AGENT - GET ONE TICKET
// ========================================

router.get(

    "/tickets/:id",

    authMiddleware,

    authorizeRoles("agent"),

    getAssignedTicketById

);


// ========================================
// AGENT - UPDATE TICKET STATUS
// ========================================

router.patch(

    "/tickets/:id/status",

    authMiddleware,

    authorizeRoles("agent"),

    updateAssignedTicketStatus

);


module.exports = router;
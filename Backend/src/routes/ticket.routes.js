const express = require("express");

const {

    createTicket,
    getMyTickets,
    getTicketById,
    getAllTickets,
    getTicketAnalytics,
    assignTicket,
    updateTicketStatus,
    addTicketComment

} = require("../controllers/ticket.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");

const adminMiddleware =
    require("../middlewares/admin.middleware");

const router = express.Router();


// ========================================
// CREATE TICKET
// ========================================

router.post(
    "/",
    authMiddleware,
    createTicket
);


// ========================================
// MY TICKETS
// ========================================

router.get(
    "/my",
    authMiddleware,
    getMyTickets
);


// ========================================
// ALL TICKETS - ADMIN
// ========================================

router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    getAllTickets
);


// ========================================
// ANALYTICS - ADMIN
// ========================================

router.get(
    "/analytics",
    authMiddleware,
    adminMiddleware,
    getTicketAnalytics
);


// ========================================
// ADD COMMENT
// CUSTOMER <-> AGENT <-> ADMIN
// ========================================

router.post(
    "/:id/comments",
    authMiddleware,
    addTicketComment
);


// ========================================
// ASSIGN TICKET
// ========================================

router.patch(
    "/:id/assign",
    authMiddleware,
    adminMiddleware,
    assignTicket
);


// ========================================
// UPDATE STATUS
// ========================================

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateTicketStatus
);


// ========================================
// GET ONE TICKET
// ========================================

router.get(
    "/:id",
    authMiddleware,
    getTicketById
);


module.exports = router;
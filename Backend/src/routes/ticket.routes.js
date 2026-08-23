const express = require("express");

const {
    createTicket,
    getMyTickets,
    getTicketById,
    getAllTickets,
    assignTicket,
    updateTicketStatus
} = require("../controllers/ticket.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createTicket
);

router.get(
    "/my",
    authMiddleware,
    getMyTickets
);

router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    getAllTickets
);

router.patch(
    "/:id/assign",
    authMiddleware,
    adminMiddleware,
    assignTicket
);

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateTicketStatus
);

router.get(
    "/:id",
    authMiddleware,
    getTicketById
);

module.exports = router;
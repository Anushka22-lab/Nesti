const express = require("express");

const {

    getAllIssues,

    getIssueById,

    getIssueTickets,

    getTopIssues,

    getEmergingIssues

} = require("../controllers/issue.controller");


const authMiddleware =
    require("../middlewares/auth.middleware");


const adminMiddleware =
    require("../middlewares/admin.middleware");


const router = express.Router();


// ======================================================
// GET ALL RECURRING ISSUES - ADMIN
// ======================================================

router.get(

    "/",

    authMiddleware,

    adminMiddleware,

    getAllIssues

);


// ======================================================
// GET TOP RECURRING ISSUES - ADMIN
// ======================================================

router.get(

    "/top",

    authMiddleware,

    adminMiddleware,

    getTopIssues

);


// ======================================================
// GET EMERGING / SPIKING ISSUES - ADMIN
// ======================================================

router.get(

    "/emerging",

    authMiddleware,

    adminMiddleware,

    getEmergingIssues

);


// ======================================================
// GET ISSUE BY ID - ADMIN
// ======================================================

router.get(

    "/:id",

    authMiddleware,

    adminMiddleware,

    getIssueById

);


// ======================================================
// GET TICKETS BELONGING TO ISSUE - ADMIN
// ======================================================

router.get(

    "/:id/tickets",

    authMiddleware,

    adminMiddleware,

    getIssueTickets

);


module.exports = router;
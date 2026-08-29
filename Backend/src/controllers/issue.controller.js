const mongoose = require("mongoose");

const issueModel =
    require("../models/issue.model");

const ticketModel =
    require("../models/ticket.model");

const {
    getEmergingIssues
} = require("../services/issue.service");


// ======================================================
// VALIDATE OBJECT ID
// ======================================================

const isValidObjectId = (id) => {

    return mongoose.Types.ObjectId.isValid(id);

};


// ======================================================
// GET ALL RECURRING ISSUES
// ======================================================

const getAllIssues = async (req, res) => {

    try {

        const issues =
            await issueModel
                .find()
                .sort({
                    ticketCount: -1,
                    lastDetectedAt: -1
                });

        return res.status(200).json({

            success: true,

            count:
                issues.length,

            issues

        });

    } catch (error) {

        console.error(
            "GET ALL ISSUES ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch recurring issues"

        });

    }

};


// ======================================================
// GET ISSUE BY ID
// ======================================================

const getIssueById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid issue ID"

            });

        }


        const issue =
            await issueModel.findById(id);


        if (!issue) {

            return res.status(404).json({

                success: false,

                message:
                    "Issue not found"

            });

        }


        return res.status(200).json({

            success: true,

            issue

        });

    } catch (error) {

        console.error(
            "GET ISSUE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch issue"

        });

    }

};


// ======================================================
// GET TICKETS FOR ISSUE
// ======================================================

const getIssueTickets = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        if (!isValidObjectId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid issue ID"

            });

        }


        const issue =
            await issueModel.findById(id);


        if (!issue) {

            return res.status(404).json({

                success: false,

                message:
                    "Issue not found"

            });

        }


        const tickets =
            await ticketModel
                .find({
                    detectedIssue: id
                })
                .populate(
                    "createdBy",
                    "name email role"
                )
                .populate(
                    "assignedTo",
                    "name email department role"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            issue: {

                id:
                    issue._id,

                issueKey:
                    issue.issueKey,

                title:
                    issue.title,

                description:
                    issue.description,

                category:
                    issue.category,

                department:
                    issue.department,

                ticketCount:
                    issue.ticketCount,

                firstDetectedAt:
                    issue.firstDetectedAt,

                lastDetectedAt:
                    issue.lastDetectedAt

            },

            count:
                tickets.length,

            tickets

        });

    } catch (error) {

        console.error(
            "GET ISSUE TICKETS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch issue tickets"

        });

    }

};


// ======================================================
// GET TOP RECURRING ISSUES
// ======================================================

const getTopIssues = async (req, res) => {

    try {

        let limit =
            parseInt(
                req.query.limit,
                10
            ) || 5;


        // Keep API safe:
        // minimum = 1
        // maximum = 20

        limit =
            Math.min(
                Math.max(limit, 1),
                20
            );


        const issues =
            await issueModel
                .find()
                .sort({
                    ticketCount: -1,
                    lastDetectedAt: -1
                })
                .limit(limit);


        return res.status(200).json({

            success: true,

            count:
                issues.length,

            issues

        });

    } catch (error) {

        console.error(
            "GET TOP ISSUES ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch top issues"

        });

    }

};


// ======================================================
// GET EMERGING ISSUES
// ======================================================
//
// Compares recent ticket activity and identifies
// recurring issues whose volume has suddenly increased.
//
// Example:
//
// Previous 24 hours = 2 tickets
// Current 24 hours  = 10 tickets
//
// This issue can be considered emerging.
//
// ======================================================

const getEmergingIssuesController =
    async (req, res) => {

        try {

            const issues =
                await getEmergingIssues();


            return res.status(200).json({

                success: true,

                count:
                    issues.length,

                issues

            });

        } catch (error) {

            console.error(
                "GET EMERGING ISSUES ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to detect emerging issues"

            });

        }

    };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    getAllIssues,

    getIssueById,

    getIssueTickets,

    getTopIssues,

    getEmergingIssues:
        getEmergingIssuesController

};
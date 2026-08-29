const issueModel = require("../models/issue.model");
const ticketModel = require("../models/ticket.model");

// ======================================================
// GET EMERGING / SPIKING ISSUES
// ======================================================

const getEmergingIssues = async () => {

    try {

        const now = new Date();

        // Today
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // Previous 24 hours
        const startOfYesterday = new Date(
            startOfToday.getTime() -
            24 * 60 * 60 * 1000
        );

        const endOfYesterday = startOfToday;


        // ==============================================
        // FIND ISSUES WITH RECENT TICKETS
        // ==============================================

        const issues =
            await issueModel
                .find({
                    lastDetectedAt: {
                        $gte: startOfYesterday
                    }
                })
                .sort({
                    ticketCount: -1
                });


        const emergingIssues = [];


        // ==============================================
        // CHECK EACH ISSUE
        // ==============================================

        for (const issue of issues) {

            // Tickets in last 24 hours
            const recentCount =
                await ticketModel.countDocuments({

                    detectedIssue:
                        issue._id,

                    createdAt: {
                        $gte: startOfYesterday
                    }

                });


            // Tickets before last 24 hours
            const previousCount =
                await ticketModel.countDocuments({

                    detectedIssue:
                        issue._id,

                    createdAt: {
                        $gte:
                            new Date(
                                startOfYesterday.getTime() -
                                24 * 60 * 60 * 1000
                            ),

                        $lt:
                            startOfYesterday

                    }

                });


            // ==========================================
            // CALCULATE CHANGE
            // ==========================================

            let percentageIncrease = 0;


            if (previousCount === 0) {

                if (recentCount > 0) {

                    percentageIncrease = 100;

                }

            } else {

                percentageIncrease =
                    Math.round(
                        (
                            (recentCount -
                                previousCount) /
                            previousCount
                        ) * 100
                    );

            }


            // ==========================================
            // SPIKE CONDITION
            // ==========================================

            /*
                We consider an issue emerging when:

                1. At least 5 tickets came recently
                2. Ticket volume increased by 50%+
            */

            if (
                recentCount >= 5 &&
                percentageIncrease >= 50
            ) {

                emergingIssues.push({

                    issueId:
                        issue._id,

                    issueKey:
                        issue.issueKey,

                    title:
                        issue.title,

                    category:
                        issue.category,

                    department:
                        issue.department,

                    recentTickets:
                        recentCount,

                    previousTickets:
                        previousCount,

                    percentageIncrease,

                    severity:
                        percentageIncrease >= 200
                            ? "critical"
                            : percentageIncrease >= 100
                                ? "high"
                                : "medium"

                });

            }

        }


        // ==============================================
        // SORT BY SPIKE
        // ==============================================

        emergingIssues.sort(
            (a, b) =>
                b.percentageIncrease -
                a.percentageIncrease
        );


        return emergingIssues;


    } catch (error) {

        console.error(
            "EMERGING ISSUE DETECTION ERROR:",
            error
        );

        throw error;

    }

};


module.exports = {
    getEmergingIssues
};
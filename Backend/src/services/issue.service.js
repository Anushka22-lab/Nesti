const issueModel = require("../models/issue.model");
const ticketModel = require("../models/ticket.model");

// ======================================================
// FIND OR CREATE RECURRING ISSUE
// ======================================================

const findOrCreateIssue = async (aiResult) => {

    try {

        if (
            !aiResult ||
            !aiResult.issueKey
        ) {
            throw new Error(
                "AI issue information is missing"
            );
        }

        const issueKey =
            aiResult.issueKey
                .trim()
                .toLowerCase();

        // ==============================================
        // FIND EXISTING ISSUE
        // ==============================================

        let issue =
            await issueModel.findOne({
                issueKey
            });

        // ==============================================
        // EXISTING ISSUE
        // ==============================================

        if (issue) {

            issue.ticketCount += 1;

            issue.lastDetectedAt =
                new Date();

            if (aiResult.category) {
                issue.category =
                    aiResult.category;
            }

            if (aiResult.suggestedDepartment) {
                issue.department =
                    aiResult.suggestedDepartment;
            }

            if (aiResult.issueTitle) {
                issue.title =
                    aiResult.issueTitle;
            }

            if (aiResult.summary) {
                issue.description =
                    aiResult.summary;
            }

            await issue.save();

            console.log(
                "♻️ Existing recurring issue updated:",
                issue.title,
                "| Tickets:",
                issue.ticketCount
            );

            return issue;
        }

        // ==============================================
        // CREATE NEW ISSUE
        // ==============================================

        issue =
            await issueModel.create({

                issueKey,

                title:
                    aiResult.issueTitle ||
                    issueKey,

                description:
                    aiResult.summary ||
                    "",

                category:
                    aiResult.category ||
                    "general",

                department:
                    aiResult.suggestedDepartment ||
                    "General Support",

                ticketCount: 1,

                firstDetectedAt:
                    new Date(),

                lastDetectedAt:
                    new Date()

            });

        console.log(
            "🆕 New recurring issue detected:",
            issue.title
        );

        return issue;

    } catch (error) {

        console.error(
            "ISSUE DETECTION ERROR:",
            error
        );

        throw error;
    }
};


// ======================================================
// GET EMERGING ISSUES
// ======================================================
//
// Compares ticket volume:
//
// Current 24 hours
// VS
// Previous 24 hours
//
// An issue is considered emerging when its recent
// ticket volume has increased significantly.
//
// ======================================================

const getEmergingIssues = async () => {

    try {

        const now = new Date();

        const currentPeriodStart =
            new Date(
                now.getTime() -
                24 * 60 * 60 * 1000
            );

        const previousPeriodStart =
            new Date(
                now.getTime() -
                48 * 60 * 60 * 1000
            );

        // ==============================================
        // CURRENT 24 HOURS
        // ==============================================

        const currentStats =
            await ticketModel.aggregate([

                {
                    $match: {
                        createdAt: {
                            $gte:
                                currentPeriodStart
                        },

                        detectedIssue: {
                            $ne: null
                        }
                    }
                },

                {
                    $group: {

                        _id:
                            "$detectedIssue",

                        currentCount: {
                            $sum: 1
                        }

                    }
                }

            ]);

        // ==============================================
        // PREVIOUS 24 HOURS
        // ==============================================

        const previousStats =
            await ticketModel.aggregate([

                {
                    $match: {

                        createdAt: {

                            $gte:
                                previousPeriodStart,

                            $lt:
                                currentPeriodStart

                        },

                        detectedIssue: {
                            $ne: null
                        }

                    }
                },

                {
                    $group: {

                        _id:
                            "$detectedIssue",

                        previousCount: {
                            $sum: 1
                        }

                    }
                }

            ]);

        // ==============================================
        // CONVERT PREVIOUS STATS TO MAP
        // ==============================================

        const previousMap =
            new Map();

        previousStats.forEach(
            (item) => {

                previousMap.set(
                    item._id.toString(),
                    item.previousCount
                );

            }
        );

        // ==============================================
        // CALCULATE EMERGING ISSUES
        // ==============================================

        const emergingIssues = [];

        for (const item of currentStats) {

            const issueId =
                item._id.toString();

            const currentCount =
                item.currentCount;

            const previousCount =
                previousMap.get(
                    issueId
                ) || 0;

            let percentageIncrease = 0;

            if (previousCount === 0) {

                percentageIncrease =
                    currentCount > 0
                        ? 100
                        : 0;

            } else {

                percentageIncrease =
                    Math.round(
                        (
                            (
                                currentCount -
                                previousCount
                            ) /
                            previousCount
                        ) * 100
                    );

            }

            // ------------------------------------------
            // EMERGING CONDITION
            // ------------------------------------------
            //
            // At least 3 current tickets AND
            // either:
            // - no previous tickets
            // - 50%+ increase
            //

            if (
                currentCount >= 3 &&
                (
                    previousCount === 0 ||
                    percentageIncrease >= 50
                )
            ) {

                const issue =
                    await issueModel.findById(
                        item._id
                    );

                if (!issue) {
                    continue;
                }

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

                    currentCount,

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
        // SORT
        // ==============================================

        emergingIssues.sort(
            (a, b) =>
                b.percentageIncrease -
                a.percentageIncrease
        );

        console.log(
            "🚨 Emerging issues found:",
            emergingIssues.length
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


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    findOrCreateIssue,

    getEmergingIssues

};
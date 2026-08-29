const { GoogleGenAI } = require("@google/genai");


// ======================================================
// GEMINI AI INITIALIZATION
// ======================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ======================================================
// ANALYZE SUPPORT TICKET
// ======================================================

const analyzeTicket = async (title, description) => {

    try {

        // ==================================================
        // PROMPT
        // ==================================================

        const prompt = `
You are an AI customer support classifier, recurring-issue detector,
and support solution recommendation assistant.

Analyze the following support ticket.

Title:
${title}

Description:
${description}

Return ONLY valid JSON.

The JSON MUST follow this exact structure:

{
    "category": "technical",
    "priority": "medium",
    "intent": "short description of customer's intent",
    "summary": "short summary of the issue",
    "suggestedDepartment": "IT Support",
    "issueKey": "short_normalized_issue_key",
    "issueTitle": "Human readable recurring issue title",
    "recommendedSolution": "practical solution or investigation steps for the support agent",
    "recommendedAction": "short immediate action the agent should take",
    "solutionConfidence": "high"
}

==================================================
ALLOWED CATEGORY VALUES
==================================================

technical
billing
account
general

==================================================
ALLOWED PRIORITY VALUES
==================================================

low
medium
high
urgent

==================================================
DEPARTMENT RULES
==================================================

suggestedDepartment MUST be exactly one of:

IT Support
Billing Support
Account Support
General Support

Use:

IT Support:
- website errors
- portal errors
- login technical problems
- server problems
- software problems
- application crashes
- technical failures

Billing Support:
- payments
- refunds
- fees
- transactions
- duplicate charges
- payment failures

Account Support:
- account details
- profile issues
- password management
- account management
- account access problems

General Support:
- anything that does not clearly fit the above

==================================================
RECURRING ISSUE DETECTION
==================================================

Create a normalized issueKey representing the underlying customer problem.

The issueKey MUST:

- be lowercase
- use snake_case
- contain no spaces
- describe the actual underlying problem
- be reusable for similar future tickets
- NOT contain customer names
- NOT contain ticket IDs
- NOT contain dates
- NOT contain random unique information
- NOT be unique for every ticket

If multiple tickets describe the same underlying problem,
they MUST receive the same issueKey.

Examples:

"I cannot login"
"Unable to sign in"
"Login stopped working"

Should produce:

"issueKey": "account_login_failure"

"issueTitle": "Account Login Failure"


Another example:

"Money was deducted twice"
"I got charged two times"

Should produce:

"issueKey": "duplicate_payment_charge"

"issueTitle": "Duplicate Payment Charge"


Another example:

"Website keeps crashing"
"The portal crashes whenever I open it"

Should produce:

"issueKey": "website_crash"

"issueTitle": "Website Crash"


==================================================
AI RECOMMENDED SOLUTION
==================================================

Based ONLY on the information available in the ticket,
recommend a practical next step for the support agent.

The recommendation should help the assigned agent
understand what they should investigate or do next.

recommendedSolution MUST:

- provide a practical troubleshooting or resolution approach
- be concise but useful
- focus on the customer's actual problem
- contain step-by-step guidance when appropriate
- NOT invent company policies
- NOT invent refund rules
- NOT invent unavailable system capabilities
- NOT guarantee that a specific action will solve the issue

If more information or investigation is required,
explicitly say that additional investigation is required.

Examples:

For a login problem:

"recommendedSolution":
"Verify the customer's account status and authentication logs,
confirm whether the credentials are being accepted, and check
for any recent authentication service errors. If necessary,
guide the customer through a password reset."

"recommendedAction":
"Verify account status and authentication logs"

"solutionConfidence":
"high"


For a duplicate payment:

"recommendedSolution":
"Review the transaction history to confirm whether two successful
charges were made for the same order. If a duplicate charge is
confirmed, follow the organization's approved refund process."

"recommendedAction":
"Verify whether the payment was duplicated"

"solutionConfidence":
"medium"


==================================================
SOLUTION CONFIDENCE
==================================================

solutionConfidence MUST be exactly one of:

low
medium
high

Use:

high:
The ticket contains enough information to provide a clear
and reliable troubleshooting direction.

medium:
A likely solution exists but additional verification is needed.

low:
There is not enough information to confidently recommend
a specific solution.

==================================================
IMPORTANT
==================================================

Do NOT create a unique issueKey for every ticket.

Focus on the underlying problem rather than the exact wording.

Do NOT include explanations outside JSON.

Do NOT add markdown.

Return ONLY valid JSON.
`;

        // ==================================================
        // GEMINI REQUEST
        // ==================================================

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.6-flash",

                contents:
                    prompt

            });


        // ==================================================
        // GET RESPONSE TEXT
        // ==================================================

        let text =
            response.text;


        if (
            !text ||
            typeof text !== "string"
        ) {

            throw new Error(
                "Empty AI response"
            );

        }


        text =
            text.trim();


        // ==================================================
        // REMOVE MARKDOWN CODE FENCES
        // ==================================================

        if (
            text.startsWith("```")
        ) {

            text =
                text
                    .replace(
                        /^```json\s*/i,
                        ""
                    )
                    .replace(
                        /^```\s*/i,
                        ""
                    )
                    .replace(
                        /\s*```$/i,
                        ""
                    )
                    .trim();

        }


        // ==================================================
        // PARSE JSON
        // ==================================================

        let result;

        try {

            result =
                JSON.parse(text);

        } catch (parseError) {

            console.error(
                "INVALID AI JSON:",
                text
            );

            throw new Error(
                "AI returned invalid JSON"
            );

        }


        // ==================================================
        // VALIDATE CATEGORY
        // ==================================================

        const allowedCategories = [

            "technical",
            "billing",
            "account",
            "general"

        ];


        if (
            !allowedCategories.includes(
                result.category
            )
        ) {

            result.category =
                "general";

        }


        // ==================================================
        // VALIDATE PRIORITY
        // ==================================================

        const allowedPriorities = [

            "low",
            "medium",
            "high",
            "urgent"

        ];


        if (
            !allowedPriorities.includes(
                result.priority
            )
        ) {

            result.priority =
                "medium";

        }


        // ==================================================
        // VALIDATE DEPARTMENT
        // ==================================================

        const allowedDepartments = [

            "IT Support",
            "Billing Support",
            "Account Support",
            "General Support"

        ];


        if (
            !allowedDepartments.includes(
                result.suggestedDepartment
            )
        ) {

            result.suggestedDepartment =
                "General Support";

        }


        // ==================================================
        // FALLBACK INTENT
        // ==================================================

        if (
            !result.intent ||
            typeof result.intent !== "string"
        ) {

            result.intent =
                "general_support_request";

        }


        // ==================================================
        // FALLBACK SUMMARY
        // ==================================================

        if (
            !result.summary ||
            typeof result.summary !== "string"
        ) {

            result.summary =
                "Customer support issue";

        }


        // ==================================================
        // NORMALIZE ISSUE KEY
        // ==================================================

        if (
            !result.issueKey ||
            typeof result.issueKey !== "string"
        ) {

            result.issueKey =
                "general_support_issue";

        } else {

            result.issueKey =
                result.issueKey
                    .trim()
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "_"
                    )
                    .replace(
                        /[^a-z0-9_]/g,
                        ""
                    );

        }


        // ==================================================
        // FALLBACK ISSUE KEY
        // ==================================================

        if (!result.issueKey) {

            result.issueKey =
                "general_support_issue";

        }


        // ==================================================
        // FALLBACK ISSUE TITLE
        // ==================================================

        if (
            !result.issueTitle ||
            typeof result.issueTitle !== "string"
        ) {

            result.issueTitle =
                "General Support Issue";

        }


        // ==================================================
        // RECOMMENDED SOLUTION
        // ==================================================

        if (
            !result.recommendedSolution ||
            typeof result.recommendedSolution !== "string"
        ) {

            result.recommendedSolution =
                "Additional investigation is required to determine the appropriate solution.";

        }


        // ==================================================
        // RECOMMENDED ACTION
        // ==================================================

        if (
            !result.recommendedAction ||
            typeof result.recommendedAction !== "string"
        ) {

            result.recommendedAction =
                "Review the ticket details and investigate the reported issue.";

        }


        // ==================================================
        // SOLUTION CONFIDENCE
        // ==================================================

        const allowedConfidence = [

            "low",
            "medium",
            "high"

        ];


        if (
            !allowedConfidence.includes(
                result.solutionConfidence
            )
        ) {

            result.solutionConfidence =
                "medium";

        }


        // ==================================================
        // FINAL RESULT
        // ==================================================

        return {

            category:
                result.category,

            priority:
                result.priority,

            intent:
                result.intent.trim(),

            summary:
                result.summary.trim(),

            suggestedDepartment:
                result.suggestedDepartment,

            issueKey:
                result.issueKey,

            issueTitle:
                result.issueTitle.trim(),

            // ==========================================
            // NEW AI RECOMMENDATION
            // ==========================================

            recommendedSolution:
                result.recommendedSolution.trim(),

            recommendedAction:
                result.recommendedAction.trim(),

            solutionConfidence:
                result.solutionConfidence

        };


    } catch (error) {

        // ==================================================
        // ERROR HANDLING
        // ==================================================

        console.error(
            "AI ANALYSIS ERROR:",
            error
        );


        throw new Error(
            "AI ticket analysis failed"
        );

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    analyzeTicket

};
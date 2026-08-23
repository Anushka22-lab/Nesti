const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeTicket = async (title, description) => {
    try {
        const prompt = `
You are an AI customer support classifier.

Analyze the following support ticket.

Title:
${title}

Description:
${description}

Return ONLY valid JSON in this exact format:

{
    "category": "technical",
    "priority": "medium",
    "intent": "short description of the customer's intent",
    "summary": "short summary of the issue",
    "suggestedDepartment": "IT Support"
}

Allowed categories:
technical, billing, account, general

Allowed priorities:
low, medium, high, urgent

IMPORTANT:
suggestedDepartment MUST be exactly one of these values:

IT Support
Billing Support
Account Support
General Support

Use:
- IT Support for website errors, portal errors, login technical problems, server issues, software problems
- Billing Support for payments, refunds, fees, transactions, duplicate charges
- Account Support for account details, profile issues, password/account management
- General Support for anything that does not fit the above

Do not add markdown.
Do not add explanations outside JSON.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const text = response.text;

        return JSON.parse(text);

    } catch (error) {
        throw new Error("AI ticket analysis failed");
    }
};

module.exports = {
    analyzeTicket
};
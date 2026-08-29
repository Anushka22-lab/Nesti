const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const agentRoutes = require("./routes/agent.routes");
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const issueRoutes = require("./routes/issue.routes");

const app = express();


// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(cookieParser());


// ======================================================
// ROUTES
// ======================================================

app.use(
    "/api/agent",
    agentRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/tickets",
    ticketRoutes
);


// ======================================================
// AI ISSUE INTELLIGENCE
// ======================================================

app.use(
    "/api/issues",
    issueRoutes
);


// ======================================================
// EXPORT
// ======================================================

module.exports = app;
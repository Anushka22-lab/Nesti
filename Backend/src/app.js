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

const allowedOrigins = [
    "http://localhost:5173",
    "https://nesti-frontend.onrender.com"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an origin
            // (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

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
// HEALTH CHECK
// ======================================================

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            message: "Nesti Backend is running"
        });
    }
);


// ======================================================
// EXPORT
// ======================================================

module.exports = app;
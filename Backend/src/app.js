const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const agentRoutes = require("./routes/agent.routes");
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/agent", agentRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

module.exports = app;
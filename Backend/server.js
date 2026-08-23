require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");

const ticketModel = require("./src/models/ticket.model");

const {
    initSocket
} = require("./src/services/socket.service");

const PORT = process.env.PORT || 5000;


// ===============================
// MongoDB
// ===============================

connectDB();


// ===============================
// Create HTTP Server
// ===============================

const server = http.createServer(app);


// ===============================
// Create Socket.IO Server
// ===============================

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});


// ===============================
// Initialize Socket Service
// ===============================

initSocket(io);


// ===============================
// Socket Authentication
// ===============================

io.use((socket, next) => {

    try {

        // Read cookies sent by browser
        const cookies = cookie.parse(
            socket.handshake.headers.cookie || ""
        );

        // Get JWT from httpOnly cookie
        const token = cookies.token;

        if (!token) {

            return next(
                new Error(
                    "Authentication token required"
                )
            );
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information inside socket
        socket.user = decoded;

        next();

    } catch (error) {

        next(
            new Error(
                "Invalid authentication token"
            )
        );

    }

});


// ===============================
// Socket Connection
// ===============================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id,
        "User:",
        socket.user.id
    );


    // ===============================
    // Join Ticket Room
    // ===============================

    socket.on(
        "joinTicket",
        async (ticketId) => {

            try {

                // Find ticket
                const ticket =
                    await ticketModel.findById(
                        ticketId
                    );

                // Ticket doesn't exist
                if (!ticket) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "Ticket not found"
                        }
                    );

                }


                const userId =
                    socket.user.id;


                // Check if user created the ticket
                const isCustomer =
                    ticket.createdBy
                        .toString() === userId;


                // Check if user is assigned agent
                const isAssignedAgent =
                    ticket.assignedTo &&
                    ticket.assignedTo
                        .toString() === userId;


                // User doesn't have access
                if (
                    !isCustomer &&
                    !isAssignedAgent
                ) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "You do not have access to this ticket"
                        }
                    );

                }


                // Join private ticket room
                socket.join(
                    `ticket_${ticketId}`
                );


                console.log(
                    `${socket.id} joined ticket_${ticketId}`
                );


                // Tell client that room was joined
                socket.emit(
                    "joinedTicket",
                    {
                        ticketId
                    }
                );

            } catch (error) {

                console.error(
                    "Join ticket error:",
                    error.message
                );

                socket.emit(
                    "socketError",
                    {
                        message:
                            "Unable to join ticket"
                    }
                );

            }

        }
    );


    // ===============================
    // Disconnect
    // ===============================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        }
    );

});


// ===============================
// Start Server
// ===============================

server.listen(
    PORT,
    () => {

        console.log(
            `Server is running on port ${PORT}`
        );

    }
);
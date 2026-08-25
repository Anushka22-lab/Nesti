require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");

const ticketModel = require("./src/models/ticket.model");
const {
    initSocket
} = require("./src/services/socket.service");

const PORT = process.env.PORT || 5000;


// ========================================
// MONGODB
// ========================================

connectDB();


// ========================================
// HTTP SERVER
// ========================================

const server = http.createServer(app);


// ========================================
// SOCKET.IO
// ========================================

const io = new Server(server, {

    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

});


// ========================================
// INITIALIZE SOCKET SERVICE
// ========================================

initSocket(io);


// ========================================
// SOCKET AUTHENTICATION
// ========================================

io.use((socket, next) => {

    try {

        /*
         * Preferred method:
         * frontend sends JWT through:
         *
         * socket.handshake.auth.token
         */

        const authToken =
            socket.handshake.auth?.token;


        if (authToken) {

            const decoded =
                jwt.verify(
                    authToken,
                    process.env.JWT_SECRET
                );

            socket.user = decoded;

            console.log(
                "SOCKET AUTH SUCCESS:",
                decoded.id,
                decoded.role
            );

            return next();

        }


        /*
         * Fallback:
         * Read JWT directly from httpOnly cookie.
         *
         * We intentionally DON'T use cookie.parse()
         * because your current cookie package setup
         * was causing:
         *
         * cookie.parse is not a function
         */

        const cookieHeader =
            socket.handshake.headers.cookie || "";


        let token = null;


        const cookies =
            cookieHeader
                .split(";")
                .map(
                    item => item.trim()
                );


        for (const item of cookies) {

            const [key, ...valueParts] =
                item.split("=");

            if (key === "token") {

                token =
                    valueParts.join("=");

                break;

            }

        }


        if (!token) {

            console.log(
                "SOCKET AUTH FAILED: No JWT found"
            );

            return next(
                new Error(
                    "Authentication token required"
                )
            );

        }


        const decoded =
            jwt.verify(
                decodeURIComponent(token),
                process.env.JWT_SECRET
            );


        socket.user = decoded;


        console.log(
            "SOCKET COOKIE AUTH SUCCESS:",
            decoded.id,
            decoded.role
        );


        next();


    } catch (error) {

        console.error(
            "SOCKET AUTH ERROR:",
            error.message
        );

        next(
            new Error(
                "Invalid authentication token"
            )
        );

    }

});


// ========================================
// SOCKET CONNECTION
// ========================================

io.on("connection", (socket) => {

    console.log(
        "USER CONNECTED:",
        socket.id
    );

    console.log(
        "USER:",
        socket.user.id
    );

    console.log(
        "ROLE:",
        socket.user.role
    );


    // ====================================
    // JOIN TICKET ROOM
    // ====================================

    socket.on(
        "joinTicket",
        async (ticketId) => {

            try {

                const ticket =
                    await ticketModel.findById(
                        ticketId
                    );


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


                const isCustomer =
                    ticket.createdBy &&
                    ticket.createdBy.toString() ===
                    userId;


                const isAssignedAgent =
                    ticket.assignedTo &&
                    ticket.assignedTo.toString() ===
                    userId;


                /*
                 * Admin can access any ticket.
                 */

                const isAdmin =
                    socket.user.role === "admin";


                if (
                    !isCustomer &&
                    !isAssignedAgent &&
                    !isAdmin
                ) {

                    return socket.emit(
                        "socketError",
                        {
                            message:
                                "You do not have access to this ticket"
                        }
                    );

                }


                const room =
                    `ticket_${ticketId}`;


                /*
                 * Prevent duplicate join logs.
                 */

                if (
                    socket.rooms.has(room)
                ) {

                    return;

                }


                socket.join(room);


                console.log(
                    `${socket.user.role} joined ${room}`
                );


                socket.emit(
                    "joinedTicket",
                    {
                        ticketId
                    }
                );


            } catch (error) {

                console.error(
                    "JOIN TICKET ERROR:",
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


    // ====================================
    // DISCONNECT
    // ====================================

    socket.on(
        "disconnect",
        (reason) => {

            console.log(
                "USER DISCONNECTED:",
                socket.id,
                reason
            );

        }
    );

});


// ========================================
// START SERVER
// ========================================

server.listen(
    PORT,
    () => {

        console.log(
            "================================"
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            "Socket.IO ready"
        );

        console.log(
            "================================"
        );

    }
);
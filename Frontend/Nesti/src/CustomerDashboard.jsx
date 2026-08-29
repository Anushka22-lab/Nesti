import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    io
} from "socket.io-client";

import api from "./services/api";


const SOCKET_URL =
    "http://localhost:5000";


function CustomerDashboard({
    user,
    onLogout
}) {

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [creating, setCreating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [commentText, setCommentText] =
        useState({});

    const [sendingComment, setSendingComment] =
        useState(null);


    // ======================================================
    // SOCKET REFS
    // ======================================================

    const socketRef =
        useRef(null);

    const ticketsRef =
        useRef([]);

    const joinedTicketsRef =
        useRef(new Set());


    // ======================================================
    // KEEP REF UPDATED
    // ======================================================

    useEffect(() => {

        ticketsRef.current =
            tickets;

    }, [tickets]);


    // ======================================================
    // FETCH CUSTOMER TICKETS
    // ======================================================

    const fetchTickets = async () => {

        try {

            setError("");

            const response =
                await api.get(
                    "/tickets/my"
                );


            const fetchedTickets =
                response.data.tickets || [];


            setTickets(
                fetchedTickets
            );


            ticketsRef.current =
                fetchedTickets;


        } catch (err) {

            console.error(
                "FETCH CUSTOMER TICKETS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to load your tickets"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // INITIAL FETCH
    // ======================================================

    useEffect(() => {

        fetchTickets();

    }, []);


    // ======================================================
    // SOCKET CONNECTION
    // ======================================================

    useEffect(() => {

        console.log(
            "Creating customer Socket.IO connection..."
        );


        const socket =
            io(
                SOCKET_URL,
                {
                    withCredentials: true,

                    transports: [
                        "websocket",
                        "polling"
                    ]
                }
            );


        socketRef.current =
            socket;


        // ==================================================
        // CONNECT
        // ==================================================

        socket.on(
            "connect",
            () => {

                console.log(
                    "Customer socket connected:",
                    socket.id
                );


                joinedTicketsRef.current.clear();


                ticketsRef.current.forEach(
                    (ticket) => {

                        socket.emit(
                            "joinTicket",
                            ticket._id
                        );


                        joinedTicketsRef.current.add(
                            ticket._id
                        );

                    }
                );

            }
        );


        // ==================================================
        // JOIN CONFIRMATION
        // ==================================================

        socket.on(
            "joinedTicket",
            (data) => {

                console.log(
                    "Customer joined ticket:",
                    data
                );

            }
        );


        // ==================================================
        // TICKET CREATED
        // ==================================================

        socket.on(
            "ticketCreated",
            (data) => {

                if (
                    !data ||
                    !data.ticket
                ) {

                    return;

                }


                const newTicket =
                    data.ticket;


                setTickets(
                    (previousTickets) => {

                        const exists =
                            previousTickets.some(
                                (ticket) =>
                                    ticket._id ===
                                    newTicket._id
                            );


                        if (exists) {

                            return previousTickets;

                        }


                        const updated = [

                            newTicket,

                            ...previousTickets

                        ];


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );


                // Join newly created ticket

                if (
                    socket.connected &&
                    !joinedTicketsRef.current.has(
                        newTicket._id
                    )
                ) {

                    socket.emit(
                        "joinTicket",
                        newTicket._id
                    );


                    joinedTicketsRef.current.add(
                        newTicket._id
                    );

                }

            }
        );


        // ==================================================
        // STATUS UPDATE
        // ==================================================

        socket.on(
            "ticketStatusUpdated",
            (data) => {

                console.log(
                    "LIVE STATUS UPDATE:",
                    data
                );


                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) => {

                                    if (
                                        ticket._id !==
                                        data.ticketId
                                    ) {

                                        return ticket;

                                    }


                                    return {

                                        ...ticket,

                                        status:
                                            data.status

                                    };

                                }
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );


                if (
                    data.status ===
                    "in-progress"
                ) {

                    setSuccess(
                        "Your ticket is now in progress 🚀"
                    );

                }


                if (
                    data.status ===
                    "resolved"
                ) {

                    setSuccess(
                        "Your ticket has been resolved 🎉"
                    );

                }


                if (
                    data.status ===
                    "open"
                ) {

                    setSuccess(
                        "Your ticket is now open."
                    );

                }

            }
        );


        // ==================================================
        // NEW COMMENT
        // ==================================================

        socket.on(
            "ticketCommentAdded",
            (data) => {

                console.log(
                    "💬 LIVE COMMENT:",
                    data
                );


                if (
                    !data ||
                    !data.ticketId ||
                    !data.comment
                ) {

                    return;

                }


                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) => {

                                    if (
                                        ticket._id !==
                                        data.ticketId
                                    ) {

                                        return ticket;

                                    }


                                    const existingComments =
                                        ticket.comments || [];


                                    const alreadyExists =
                                        existingComments.some(
                                            (comment) =>
                                                comment._id ===
                                                data.comment._id
                                        );


                                    if (
                                        alreadyExists
                                    ) {

                                        return ticket;

                                    }


                                    return {

                                        ...ticket,

                                        comments: [
                                            ...existingComments,
                                            data.comment
                                        ]

                                    };

                                }
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );

            }
        );


        // ==================================================
        // SOCKET ERROR
        // ==================================================

        socket.on(
            "socketError",
            (data) => {

                console.error(
                    "Socket error:",
                    data
                );

            }
        );


        // ==================================================
        // CONNECT ERROR
        // ==================================================

        socket.on(
            "connect_error",
            (err) => {

                console.error(
                    "Customer socket connection error:",
                    err.message
                );

            }
        );


        // ==================================================
        // DISCONNECT
        // ==================================================

        socket.on(
            "disconnect",
            (reason) => {

                console.log(
                    "Customer socket disconnected:",
                    reason
                );


                joinedTicketsRef.current.clear();

            }
        );


        // ==================================================
        // CLEANUP
        // ==================================================

        return () => {

            socket.removeAllListeners();

            socket.disconnect();

            joinedTicketsRef.current.clear();

            socketRef.current = null;

        };

    }, []);


    // ======================================================
    // JOIN NEW TICKET ROOMS
    // ======================================================

    useEffect(() => {

        const socket =
            socketRef.current;


        if (
            !socket ||
            !socket.connected
        ) {

            return;

        }


        tickets.forEach(
            (ticket) => {

                if (
                    joinedTicketsRef.current.has(
                        ticket._id
                    )
                ) {

                    return;

                }


                socket.emit(
                    "joinTicket",
                    ticket._id
                );


                joinedTicketsRef.current.add(
                    ticket._id
                );

            }
        );

    }, [tickets]);


    // ======================================================
    // CREATE TICKET
    // ======================================================

    const handleCreateTicket = async (
        e
    ) => {

        e.preventDefault();


        if (
            !title.trim() ||
            !description.trim()
        ) {

            setError(
                "Please enter both title and description."
            );

            setSuccess("");

            return;

        }


        try {

            setCreating(true);

            setError("");

            setSuccess("");


            const response =
                await api.post(
                    "/tickets",
                    {
                        title:
                            title.trim(),

                        description:
                            description.trim()
                    }
                );


            const createdTicket =
                response.data.ticket;


            // ------------------------------------------------
            // Add immediately if returned by backend
            // ------------------------------------------------

            if (createdTicket) {

                setTickets(
                    (previousTickets) => {

                        const exists =
                            previousTickets.some(
                                (ticket) =>
                                    ticket._id ===
                                    createdTicket._id
                            );


                        if (exists) {

                            return previousTickets;

                        }


                        const updated = [

                            createdTicket,

                            ...previousTickets

                        ];


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );


                const socket =
                    socketRef.current;


                if (
                    socket &&
                    socket.connected &&
                    !joinedTicketsRef.current.has(
                        createdTicket._id
                    )
                ) {

                    socket.emit(
                        "joinTicket",
                        createdTicket._id
                    );


                    joinedTicketsRef.current.add(
                        createdTicket._id
                    );

                }

            } else {

                await fetchTickets();

            }


            setTitle("");

            setDescription("");

            setShowCreateForm(false);


            setSuccess(
                "Ticket created successfully 🎉 Nesti has analyzed your request."
            );


        } catch (err) {

            console.error(
                "CREATE TICKET ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to create ticket"
            );

            setSuccess("");

        } finally {

            setCreating(false);

        }

    };


    // ======================================================
    // SEND COMMENT
    // ======================================================

    const sendComment = async (
        ticketId
    ) => {

        const message =
            commentText[ticketId]
                ?.trim();


        if (!message) {

            return;

        }


        try {

            setSendingComment(
                ticketId
            );

            setError("");


            const response =
                await api.post(
                    `/tickets/${ticketId}/comments`,
                    {
                        message
                    }
                );


            const newComment =
                response.data.comment;


            if (newComment) {

                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) => {

                                    if (
                                        ticket._id !==
                                        ticketId
                                    ) {

                                        return ticket;

                                    }


                                    const comments =
                                        ticket.comments ||
                                        [];


                                    const exists =
                                        comments.some(
                                            (comment) =>
                                                comment._id ===
                                                newComment._id
                                        );


                                    if (exists) {

                                        return ticket;

                                    }


                                    return {

                                        ...ticket,

                                        comments: [
                                            ...comments,
                                            newComment
                                        ]

                                    };

                                }
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );

            }


            setCommentText(
                (previous) => ({

                    ...previous,

                    [ticketId]:
                        ""

                })
            );


        } catch (err) {

            console.error(
                "SEND COMMENT ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to send message"
            );

        } finally {

            setSendingComment(null);

        }

    };


    // ======================================================
    // ENTER TO SEND
    // ======================================================

    const handleCommentKeyDown = (
        e,
        ticketId
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendComment(
                ticketId
            );

        }

    };


    // ======================================================
    // STATUS STYLE
    // ======================================================

    const getStatusStyle = (
        status
    ) => {

        if (
            status === "open"
        ) {

            return styles.statusOpen;

        }


        if (
            status === "in-progress"
        ) {

            return styles.statusProgress;

        }


        if (
            status === "resolved"
        ) {

            return styles.statusResolved;

        }


        if (
            status === "closed"
        ) {

            return styles.statusClosed;

        }


        return styles.statusDefault;

    };


    // ======================================================
    // PRIORITY STYLE
    // ======================================================

    const getPriorityStyle = (
        priority
    ) => {

        if (
            priority === "urgent"
        ) {

            return styles.priorityUrgent;

        }


        if (
            priority === "high"
        ) {

            return styles.priorityHigh;

        }


        if (
            priority === "low"
        ) {

            return styles.priorityLow;

        }


        return styles.priorityMedium;

    };


    // ======================================================
    // AI CONFIDENCE STYLE
    // ======================================================

    const getConfidenceStyle = (
        confidence
    ) => {

        if (
            confidence === "high"
        ) {

            return styles.confidenceHigh;

        }


        if (
            confidence === "low"
        ) {

            return styles.confidenceLow;

        }


        return styles.confidenceMedium;

    };


    // ======================================================
    // AI STATUS MESSAGE
    // ======================================================

    const getAIStatusMessage = (
        ticket
    ) => {

        const confidence =
            ticket
                ?.aiAnalysis
                ?.solutionConfidence;


        if (
            confidence === "high"
        ) {

            return "Nesti AI has analyzed your request and identified a clear support direction.";

        }


        if (
            confidence === "medium"
        ) {

            return "Nesti AI has analyzed your request. Your support team may need to verify a few details.";

        }


        if (
            confidence === "low"
        ) {

            return "Nesti AI has analyzed your request. Your support team will investigate it further.";

        }


        return "Nesti AI has analyzed your request and routed it to the appropriate support team.";

    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <div style={styles.loadingIcon}>
                        🤖
                    </div>

                    <h2>
                        Loading Nesti...
                    </h2>

                    <p>
                        Fetching your support tickets
                    </p>

                </div>

            </div>

        );

    }


    // ======================================================
    // DASHBOARD
    // ======================================================

    return (

        <div style={styles.page}>

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <nav style={styles.navbar}>

                <div>

                    <h2 style={styles.logo}>
                        Nesti
                    </h2>

                    <p style={styles.subtitle}>
                        AI-powered customer support
                    </p>

                </div>


                <div style={styles.navRight}>

                    <div style={styles.userInfo}>

                        <strong>
                            {
                                user?.name ||
                                "Customer"
                            }
                        </strong>

                        <span>
                            {
                                user?.email ||
                                ""
                            }
                        </span>

                    </div>


                    <button
                        onClick={onLogout}
                        style={
                            styles.logoutButton
                        }
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main style={styles.container}>


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.heading}>
                            Welcome,{" "}
                            {
                                user?.name ||
                                "Customer"
                            } 👋
                        </h1>

                        <p
                            style={
                                styles.headerText
                            }
                        >
                            Create and track your support
                            tickets with Nesti.
                        </p>

                    </div>


                    <div style={styles.stats}>

                        <strong
                            style={
                                styles.statNumber
                            }
                        >
                            {
                                tickets.length
                            }
                        </strong>

                        <span>
                            My Tickets
                        </span>

                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div style={styles.error}>
                        {error}
                    </div>

                )}


                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (

                    <div style={styles.success}>
                        {success}
                    </div>

                )}


                {/* ==================================================
                    TICKET HEADER
                ================================================== */}

                <div
                    style={
                        styles.createHeader
                    }
                >

                    <h2
                        style={
                            styles.sectionTitle
                        }
                    >
                        My Support Tickets
                    </h2>


                    <button
                        onClick={() => {

                            setShowCreateForm(
                                !showCreateForm
                            );

                            setError("");

                            setSuccess("");

                        }}
                        style={
                            styles.createButton
                        }
                    >

                        {
                            showCreateForm
                                ? "Close"
                                : "+ Create Ticket"
                        }

                    </button>

                </div>


                {/* ==================================================
                    CREATE FORM
                ================================================== */}

                {showCreateForm && (

                    <form
                        onSubmit={
                            handleCreateTicket
                        }
                        style={styles.form}
                    >

                        <div
                            style={
                                styles.formHeader
                            }
                        >

                            <div>

                                <span
                                    style={
                                        styles.formEyebrow
                                    }
                                >
                                    NESTI AI
                                </span>

                                <h2
                                    style={
                                        styles.formTitle
                                    }
                                >
                                    Create a Support Ticket
                                </h2>

                                <p
                                    style={
                                        styles.formDescription
                                    }
                                >
                                    Tell us what happened.
                                    Nesti will analyze your
                                    request and route it to
                                    the right support team.
                                </p>

                            </div>

                            <div
                                style={
                                    styles.formAIIcon
                                }
                            >
                                🤖
                            </div>

                        </div>


                        <label
                            style={
                                styles.label
                            }
                        >
                            Ticket Title
                        </label>


                        <input
                            type="text"
                            placeholder="Example: College website is not opening"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            style={
                                styles.input
                            }
                            disabled={
                                creating
                            }
                        />


                        <label
                            style={
                                styles.label
                            }
                        >
                            Description
                        </label>


                        <textarea
                            placeholder="Explain your problem in as much detail as possible..."
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            style={
                                styles.textarea
                            }
                            disabled={
                                creating
                            }
                        />


                        <button
                            type="submit"
                            disabled={
                                creating
                            }
                            style={{
                                ...styles.submitButton,

                                ...(creating
                                    ? styles.disabledButton
                                    : {})
                            }}
                        >

                            {
                                creating
                                    ? "🤖 Nesti is analyzing..."
                                    : "Submit Ticket →"
                            }

                        </button>

                    </form>

                )}


                {/* ==================================================
                    NO TICKETS
                ================================================== */}

                {tickets.length === 0 ? (

                    <div style={styles.empty}>

                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🎫
                        </div>

                        <h2>
                            No tickets yet
                        </h2>

                        <p>
                            Create your first support
                            ticket and Nesti will help
                            route it to the right team.
                        </p>


                        <button
                            onClick={() =>
                                setShowCreateForm(true)
                            }
                            style={
                                styles.emptyButton
                            }
                        >
                            Create Your First Ticket
                        </button>

                    </div>

                ) : (

                    <div
                        style={
                            styles.ticketGrid
                        }
                    >

                        {tickets.map(
                            (ticket) => (

                                <div
                                    key={
                                        ticket._id
                                    }
                                    style={
                                        styles.ticket
                                    }
                                >

                                    {/* ==================================================
                                        TICKET TOP
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.ticketTop
                                        }
                                    >

                                        <div
                                            style={
                                                styles.titleArea
                                            }
                                        >

                                            <h2
                                                style={
                                                    styles.ticketTitle
                                                }
                                            >
                                                {
                                                    ticket.title
                                                }
                                            </h2>


                                            <small
                                                style={
                                                    styles.ticketId
                                                }
                                            >
                                                Ticket #
                                                {
                                                    ticket._id
                                                        ?.slice(-8)
                                                        .toUpperCase()
                                                }
                                            </small>

                                        </div>


                                        <span
                                            style={{
                                                ...styles.status,
                                                ...getStatusStyle(
                                                    ticket.status
                                                )
                                            }}
                                        >
                                            {
                                                ticket.status
                                            }
                                        </span>

                                    </div>


                                    {/* ==================================================
                                        DESCRIPTION
                                    ================================================== */}

                                    <p
                                        style={
                                            styles.description
                                        }
                                    >
                                        {
                                            ticket.description
                                        }
                                    </p>


                                    {/* ==================================================
                                        TAGS
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.tags
                                        }
                                    >

                                        <span
                                            style={
                                                styles.category
                                            }
                                        >
                                            {
                                                ticket.category ||
                                                "general"
                                            }
                                        </span>


                                        <span
                                            style={{
                                                ...styles.priority,
                                                ...getPriorityStyle(
                                                    ticket.priority
                                                )
                                            }}
                                        >
                                            {
                                                ticket.priority ||
                                                "medium"
                                            }
                                        </span>

                                    </div>


                                    <hr
                                        style={
                                            styles.line
                                        }
                                    />


                                    {/* ==================================================
                                        AGENT + DEPARTMENT
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.infoGrid
                                        }
                                    >

                                        <div>

                                            <strong
                                                style={
                                                    styles.infoTitle
                                                }
                                            >
                                                Assigned Agent
                                            </strong>


                                            <p
                                                style={
                                                    styles.infoText
                                                }
                                            >
                                                {
                                                    ticket
                                                        .assignedTo
                                                        ?.name ||
                                                    "Not assigned yet"
                                                }
                                            </p>


                                            {
                                                ticket
                                                    .assignedTo
                                                    ?.email && (

                                                    <small
                                                        style={
                                                            styles.email
                                                        }
                                                    >
                                                        {
                                                            ticket
                                                                .assignedTo
                                                                .email
                                                        }
                                                    </small>

                                                )
                                            }

                                        </div>


                                        <div>

                                            <strong
                                                style={
                                                    styles.infoTitle
                                                }
                                            >
                                                Support Department
                                            </strong>


                                            <p
                                                style={
                                                    styles.infoText
                                                }
                                            >
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        ?.suggestedDepartment ||
                                                    "Being analyzed"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        CUSTOMER-FACING AI STATUS
                                    ================================================== */}

                                    {ticket.aiAnalysis && (

                                        <div
                                            style={
                                                styles.aiCustomerBox
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.aiCustomerHeader
                                                }
                                            >

                                                <div>

                                                    <span
                                                        style={
                                                            styles.aiEyebrow
                                                        }
                                                    >
                                                        NESTI AI
                                                    </span>

                                                    <h3
                                                        style={
                                                            styles.aiCustomerTitle
                                                        }
                                                    >
                                                        🤖 Your request has been analyzed
                                                    </h3>

                                                </div>


                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .solutionConfidence && (

                                                        <span
                                                            style={{
                                                                ...styles.confidenceBadge,
                                                                ...getConfidenceStyle(
                                                                    ticket
                                                                        .aiAnalysis
                                                                        .solutionConfidence
                                                                )
                                                            }}
                                                        >
                                                            AI{" "}
                                                            {
                                                                ticket
                                                                    .aiAnalysis
                                                                    .solutionConfidence
                                                                    .toUpperCase()
                                                            }
                                                        </span>

                                                    )
                                                }

                                            </div>


                                            <p
                                                style={
                                                    styles.aiCustomerMessage
                                                }
                                            >
                                                {
                                                    getAIStatusMessage(
                                                        ticket
                                                    )
                                                }
                                            </p>


                                            <div
                                                style={
                                                    styles.aiSummary
                                                }
                                            >

                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .summary && (

                                                        <div
                                                            style={
                                                                styles.aiSummaryItem
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    styles.aiSummaryLabel
                                                                }
                                                            >
                                                                Issue Summary
                                                            </span>

                                                            <strong>
                                                                {
                                                                    ticket
                                                                        .aiAnalysis
                                                                        .summary
                                                                }
                                                            </strong>

                                                        </div>

                                                    )
                                                }


                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .category && (

                                                        <div
                                                            style={
                                                                styles.aiSummaryItem
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    styles.aiSummaryLabel
                                                                }
                                                            >
                                                                Category
                                                            </span>

                                                            <strong>
                                                                {
                                                                    ticket
                                                                        .aiAnalysis
                                                                        .category
                                                            }
                                                            </strong>

                                                        </div>

                                                    )
                                                }

                                            </div>


                                            <div
                                                style={
                                                    styles.aiPrivacyNote
                                                }
                                            >
                                                ✨ Nesti uses AI to
                                                understand and route
                                                your request. Your
                                                support agent will
                                                handle the next steps.
                                            </div>

                                        </div>

                                    )}


                                    {/* ==================================================
                                        CONVERSATION
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.commentsSection
                                        }
                                    >

                                        <div
                                            style={
                                                styles.commentsHeader
                                            }
                                        >

                                            <h3
                                                style={{
                                                    margin: 0
                                                }}
                                            >
                                                💬 Conversation
                                            </h3>


                                            <span
                                                style={
                                                    styles.commentCount
                                                }
                                            >
                                                {
                                                    (
                                                        ticket.comments ||
                                                        []
                                                    ).length
                                                }{" "}
                                                messages
                                            </span>

                                        </div>


                                        <div
                                            style={
                                                styles.commentsList
                                            }
                                        >

                                            {
                                                (
                                                    ticket.comments ||
                                                    []
                                                ).length === 0
                                                    ? (

                                                        <div
                                                            style={
                                                                styles.noComments
                                                            }
                                                        >
                                                            No replies yet.
                                                            Your support
                                                            agent will
                                                            respond here.
                                                        </div>

                                                    )
                                                    : (

                                                        ticket.comments.map(
                                                            (
                                                                comment,
                                                                index
                                                            ) => {

                                                                const commentAuthorId =
                                                                    comment.author?._id ||
                                                                    comment.author;


                                                                const currentUserId =
                                                                    user?._id ||
                                                                    user?.id;


                                                                const isMine =
                                                                    commentAuthorId
                                                                        ?.toString() ===
                                                                    currentUserId
                                                                        ?.toString();


                                                                return (

                                                                    <div
                                                                        key={
                                                                            comment._id ||
                                                                            index
                                                                        }
                                                                        style={{
                                                                            ...styles.comment,

                                                                            ...(isMine
                                                                                ? styles.myComment
                                                                                : styles.otherComment)
                                                                        }}
                                                                    >

                                                                        <div
                                                                            style={
                                                                                styles.commentMeta
                                                                            }
                                                                        >

                                                                            <strong>
                                                                                {
                                                                                    comment
                                                                                        .author
                                                                                        ?.name ||
                                                                                    (
                                                                                        isMine
                                                                                            ? "You"
                                                                                            : comment.authorRole
                                                                                                ?.toUpperCase()
                                                                                    )
                                                                                }
                                                                            </strong>


                                                                            <span>
                                                                                {
                                                                                    comment.createdAt
                                                                                        ? new Date(
                                                                                            comment.createdAt
                                                                                        ).toLocaleString()
                                                                                        : ""
                                                                                }
                                                                            </span>

                                                                        </div>


                                                                        <p
                                                                            style={
                                                                                styles.commentMessage
                                                                            }
                                                                        >
                                                                            {
                                                                                comment.message
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                );

                                                            }
                                                        )

                                                    )
                                            }

                                        </div>


                                        {/* ==================================================
                                            COMMENT COMPOSER
                                        ================================================== */}

                                        <div
                                            style={
                                                styles.commentComposer
                                            }
                                        >

                                            <textarea
                                                value={
                                                    commentText[
                                                        ticket._id
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    setCommentText(
                                                        (previous) => ({

                                                            ...previous,

                                                            [ticket._id]:
                                                                e.target.value

                                                        })
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleCommentKeyDown(
                                                        e,
                                                        ticket._id
                                                    )
                                                }
                                                placeholder="Write a message to your support team..."
                                                style={
                                                    styles.commentInput
                                                }
                                                disabled={
                                                    sendingComment ===
                                                    ticket._id
                                                }
                                            />


                                            <button
                                                onClick={() =>
                                                    sendComment(
                                                        ticket._id
                                                    )
                                                }
                                                disabled={
                                                    sendingComment ===
                                                        ticket._id ||
                                                    !commentText[
                                                        ticket._id
                                                    ]?.trim()
                                                }
                                                style={{
                                                    ...styles.sendButton,

                                                    ...(
                                                        sendingComment ===
                                                            ticket._id ||
                                                        !commentText[
                                                            ticket._id
                                                        ]?.trim()
                                                            ? styles.sendDisabled
                                                            : {}
                                                    )
                                                }}
                                            >

                                                {
                                                    sendingComment ===
                                                    ticket._id
                                                        ? "Sending..."
                                                        : "Send"
                                                }

                                            </button>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        CREATED DATE
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.date
                                        }
                                    >
                                        Created:{" "}
                                        {
                                            ticket.createdAt
                                                ? new Date(
                                                    ticket.createdAt
                                                ).toLocaleString()
                                                : "N/A"
                                        }
                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>

    );

}


// ======================================================
// STYLES
// ======================================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "#1f2937"
    },


    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb"
    },


    loadingCard: {
        background: "white",
        padding: "40px",
        borderRadius: "18px",
        textAlign: "center",
        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)"
    },


    loadingIcon: {
        fontSize: "40px",
        marginBottom: "10px"
    },


    navbar: {
        minHeight: "70px",
        padding: "0 40px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.06)"
    },


    logo: {
        margin: 0,
        fontSize: "24px"
    },


    subtitle: {
        margin: "4px 0 0",
        color: "#6b7280",
        fontSize: "14px"
    },


    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },


    userInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "3px"
    },


    logoutButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#111827",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },


    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 25px"
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "35px",
        gap: "30px"
    },


    heading: {
        margin: 0,
        fontSize: "32px"
    },


    headerText: {
        color: "#6b7280",
        fontSize: "16px",
        marginTop: "8px"
    },


    stats: {
        minWidth: "140px",
        padding: "20px 25px",
        background: "white",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },


    statNumber: {
        fontSize: "28px"
    },


    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "20px"
    },


    success: {
        background: "#dcfce7",
        color: "#166534",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "20px"
    },


    createHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },


    sectionTitle: {
        margin: 0
    },


    createButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#111827",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },


    form: {
        background: "white",
        padding: "28px",
        borderRadius: "16px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },


    formHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },


    formEyebrow: {
        color: "#8b5cf6",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.08em"
    },


    formTitle: {
        margin:
            "5px 0 7px",
        fontSize: "22px"
    },


    formDescription: {
        margin: 0,
        color: "#6b7280",
        lineHeight: "1.5"
    },


    formAIIcon: {
        fontSize: "35px",
        background: "#f5f3ff",
        padding: "12px",
        borderRadius: "12px"
    },


    label: {
        display: "block",
        marginTop: "20px",
        marginBottom: "7px",
        fontWeight: "600",
        fontSize: "14px"
    },


    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border:
            "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px"
    },


    textarea: {
        width: "100%",
        minHeight: "130px",
        boxSizing: "border-box",
        padding: "12px",
        border:
            "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        resize: "vertical",
        fontFamily: "inherit"
    },


    submitButton: {
        marginTop: "20px",
        padding: "12px 22px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },


    disabledButton: {
        opacity: 0.6,
        cursor: "not-allowed"
    },


    empty: {
        background: "white",
        padding: "60px 30px",
        textAlign: "center",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)"
    },


    emptyIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    },


    emptyButton: {
        marginTop: "15px",
        padding: "11px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },


    ticketGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "25px"
    },


    ticket: {
        background: "white",
        padding: "28px",
        borderRadius: "16px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },


    ticketTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },


    titleArea: {
        minWidth: 0
    },


    ticketTitle: {
        margin: 0,
        fontSize: "21px"
    },


    ticketId: {
        display: "block",
        marginTop: "6px",
        color: "#9ca3af",
        fontSize: "11px"
    },


    description: {
        color: "#6b7280",
        lineHeight: "1.6",
        marginTop: "18px"
    },


    tags: {
        display: "flex",
        gap: "10px",
        margin: "18px 0"
    },


    category: {
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    },


    priority: {
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    },


    priorityUrgent: {
        background: "#fee2e2",
        color: "#991b1b"
    },


    priorityHigh: {
        background: "#ffedd5",
        color: "#c2410c"
    },


    priorityMedium: {
        background: "#fef3c7",
        color: "#92400e"
    },


    priorityLow: {
        background: "#dcfce7",
        color: "#166534"
    },


    line: {
        border: "none",
        borderTop:
            "1px solid #e5e7eb",
        margin: "20px 0"
    },


    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "20px"
    },


    infoTitle: {
        fontSize: "14px"
    },


    infoText: {
        margin: "7px 0 2px",
        fontSize: "15px",
        color: "#4b5563"
    },


    email: {
        color: "#9ca3af"
    },


    // ==================================================
    // STATUS
    // ==================================================

    status: {
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },


    statusOpen: {
        background: "#fee2e2",
        color: "#991b1b"
    },


    statusProgress: {
        background: "#fef3c7",
        color: "#92400e"
    },


    statusResolved: {
        background: "#dcfce7",
        color: "#166534"
    },


    statusClosed: {
        background: "#e5e7eb",
        color: "#374151"
    },


    statusDefault: {
        background: "#e5e7eb",
        color: "#374151"
    },


    // ==================================================
    // CUSTOMER AI SECTION
    // ==================================================

    aiCustomerBox: {
        marginTop: "24px",
        padding: "19px",
        background:
            "linear-gradient(135deg, #f5f3ff, #faf5ff)",
        border:
            "1px solid #ddd6fe",
        borderRadius: "13px"
    },


    aiCustomerHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },


    aiEyebrow: {
        color: "#8b5cf6",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em"
    },


    aiCustomerTitle: {
        margin:
            "4px 0 0",
        color: "#5b21b6",
        fontSize: "17px"
    },


    confidenceBadge: {
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "800",
        whiteSpace: "nowrap"
    },


    confidenceHigh: {
        background: "#dcfce7",
        color: "#166534"
    },


    confidenceMedium: {
        background: "#fef3c7",
        color: "#92400e"
    },


    confidenceLow: {
        background: "#fee2e2",
        color: "#991b1b"
    },


    aiCustomerMessage: {
        margin:
            "14px 0",
        color: "#4b5563",
        lineHeight: "1.6"
    },


    aiSummary: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "10px"
    },


    aiSummaryItem: {
        background: "white",
        padding: "11px 12px",
        borderRadius: "9px",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },


    aiSummaryLabel: {
        color: "#8b5cf6",
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "700",
        letterSpacing: "0.04em"
    },


    aiPrivacyNote: {
        marginTop: "12px",
        fontSize: "11px",
        color: "#8b5cf6",
        fontStyle: "italic",
        lineHeight: "1.5"
    },


    // ==================================================
    // COMMENTS
    // ==================================================

    commentsSection: {
        marginTop: "25px",
        borderTop:
            "1px solid #e5e7eb",
        paddingTop: "20px"
    },


    commentsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
    },


    commentCount: {
        fontSize: "12px",
        color: "#6b7280"
    },


    commentsList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxHeight: "320px",
        overflowY: "auto",
        padding: "5px"
    },


    noComments: {
        padding: "18px",
        background: "#f9fafb",
        borderRadius: "10px",
        color: "#6b7280",
        fontSize: "13px",
        textAlign: "center"
    },


    comment: {
        padding: "12px 14px",
        borderRadius: "12px",
        maxWidth: "85%"
    },


    myComment: {
        alignSelf: "flex-end",
        background: "#eef2ff"
    },


    otherComment: {
        alignSelf: "flex-start",
        background: "#f3f4f6"
    },


    commentMeta: {
        display: "flex",
        justifyContent: "space-between",
        gap: "15px",
        marginBottom: "5px",
        fontSize: "12px"
    },


    commentMessage: {
        margin: 0,
        fontSize: "14px",
        lineHeight: "1.5",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
    },


    commentComposer: {
        display: "flex",
        gap: "10px",
        marginTop: "15px",
        alignItems: "flex-end"
    },


    commentInput: {
        flex: 1,
        minHeight: "45px",
        maxHeight: "110px",
        resize: "vertical",
        padding: "11px",
        border:
            "1px solid #d1d5db",
        borderRadius: "9px",
        fontSize: "14px",
        boxSizing: "border-box",
        fontFamily: "inherit"
    },


    sendButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "9px",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        cursor: "pointer"
    },


    sendDisabled: {
        opacity: 0.5,
        cursor: "not-allowed"
    },


    date: {
        marginTop: "20px",
        color: "#9ca3af",
        fontSize: "12px"
    }

};


export default CustomerDashboard;
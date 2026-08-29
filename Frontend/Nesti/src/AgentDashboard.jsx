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


function AgentDashboard({
    user,
    onLogout
}) {

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [updatingTicket, setUpdatingTicket] =
        useState(null);

    const [error, setError] =
        useState("");

    const [commentText, setCommentText] =
        useState({});

    const [sendingComment, setSendingComment] =
        useState(null);


    // ======================================================
    // SOCKET
    // ======================================================

    const socketRef =
        useRef(null);

    const ticketsRef =
        useRef([]);

    const joinedTicketsRef =
        useRef(new Set());


    useEffect(() => {

        ticketsRef.current =
            tickets;

    }, [tickets]);


    // ======================================================
    // FETCH ASSIGNED TICKETS
    // ======================================================

    const fetchTickets = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/agent/tickets"
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
                "FETCH AGENT TICKETS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to load tickets"
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
            "Creating agent Socket.IO connection..."
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


        // --------------------------------------------------
        // CONNECT
        // --------------------------------------------------

        socket.on(
            "connect",
            () => {

                console.log(
                    "Agent socket connected:",
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


        // --------------------------------------------------
        // JOIN CONFIRMATION
        // --------------------------------------------------

        socket.on(
            "joinedTicket",
            (data) => {

                console.log(
                    "Agent joined ticket:",
                    data
                );

            }
        );


        // --------------------------------------------------
        // COMMENT ADDED
        // --------------------------------------------------

        socket.on(
            "ticketCommentAdded",
            (data) => {

                console.log(
                    "💬 AGENT LIVE COMMENT:",
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


                                    const comments =
                                        ticket.comments ||
                                        [];


                                    const exists =
                                        comments.some(
                                            (comment) =>
                                                comment._id ===
                                                data.comment._id
                                        );


                                    if (exists) {

                                        return ticket;

                                    }


                                    return {

                                        ...ticket,

                                        comments: [
                                            ...comments,
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


        // --------------------------------------------------
        // STATUS UPDATE
        // --------------------------------------------------

        socket.on(
            "ticketStatusUpdated",
            (data) => {

                console.log(
                    "AGENT LIVE STATUS:",
                    data
                );


                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) => {

                                    if (
                                        ticket._id ===
                                        data.ticketId
                                    ) {

                                        return {

                                            ...ticket,

                                            status:
                                                data.status

                                        };

                                    }


                                    return ticket;

                                }
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );

            }
        );


        // --------------------------------------------------
        // ASSIGNMENT UPDATE
        // --------------------------------------------------

        socket.on(
            "ticketAssignmentUpdated",
            (data) => {

                console.log(
                    "AGENT LIVE ASSIGNMENT:",
                    data
                );


                fetchTickets();

            }
        );


        // --------------------------------------------------
        // NEW TICKET
        // --------------------------------------------------

        socket.on(
            "ticketCreated",
            (data) => {

                console.log(
                    "🎫 AGENT NEW TICKET:",
                    data
                );


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


                // Join newly created ticket room

                const socket =
                    socketRef.current;


                if (
                    socket &&
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


        // --------------------------------------------------
        // CONNECT ERROR
        // --------------------------------------------------

        socket.on(
            "connect_error",
            (err) => {

                console.error(
                    "Agent socket connection error:",
                    err.message
                );

            }
        );


        // --------------------------------------------------
        // DISCONNECT
        // --------------------------------------------------

        socket.on(
            "disconnect",
            (reason) => {

                console.log(
                    "Agent socket disconnected:",
                    reason
                );


                joinedTicketsRef.current.clear();

            }
        );


        // --------------------------------------------------
        // CLEANUP
        // --------------------------------------------------

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


                console.log(
                    "Joining agent ticket room:",
                    ticket._id
                );


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
    // UPDATE STATUS
    // ======================================================

    const updateStatus = async (
        ticketId,
        status
    ) => {

        try {

            setUpdatingTicket(
                ticketId
            );

            setError("");


            const response =
                await api.patch(
                    `/agent/tickets/${ticketId}/status`,
                    {
                        status
                    }
                );


            if (
                response.data.ticket
            ) {

                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) =>

                                    ticket._id ===
                                    ticketId

                                        ? {
                                            ...ticket,
                                            ...response.data.ticket
                                        }

                                        : ticket
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );

            } else {

                setTickets(
                    (previousTickets) => {

                        const updated =
                            previousTickets.map(
                                (ticket) =>

                                    ticket._id ===
                                    ticketId

                                        ? {
                                            ...ticket,
                                            status
                                        }

                                        : ticket
                            );


                        ticketsRef.current =
                            updated;


                        return updated;

                    }
                );

            }

        } catch (err) {

            console.error(
                "UPDATE STATUS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to update ticket status"
            );

        } finally {

            setUpdatingTicket(null);

        }

    };


    // ======================================================
    // USE AI RECOMMENDATION ⭐
    // ======================================================

    const useAIRecommendation = (
        ticket
    ) => {

        const recommendation =
            ticket
                ?.aiAnalysis
                ?.recommendedSolution;


        if (!recommendation) {

            setError(
                "AI recommendation is not available for this ticket."
            );

            return;

        }


        const action =
            ticket
                ?.aiAnalysis
                ?.recommendedAction;


        let reply =
            recommendation.trim();


        // --------------------------------------------------
        // Add action context when available
        // --------------------------------------------------

        if (
            action &&
            action.trim()
        ) {

            reply =
                `${reply}\n\nNext step: ${action.trim()}`;

        }


        setCommentText(
            (previous) => ({

                ...previous,

                [ticket._id]:
                    reply

            })
        );


        // Scroll naturally to composer by focusing after render

        setTimeout(() => {

            const element =
                document.getElementById(
                    `comment-${ticket._id}`
                );


            if (element) {

                element.focus();

            }

        }, 50);

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


            // ----------------------------------------------
            // LOCAL UPDATE
            // ----------------------------------------------

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
    // CONFIDENCE STYLE
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
                        Loading tickets...
                    </h2>

                    <p>
                        Nesti is preparing your workspace.
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
                            {user?.name ||
                                "Agent"}
                        </strong>

                        <span>
                            {user?.email || ""}
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
                            Agent Dashboard 👋
                        </h1>

                        <p
                            style={
                                styles.headerText
                            }
                        >
                            Manage your assigned
                            customer tickets with
                            AI-powered assistance.
                        </p>

                    </div>


                    <div style={styles.stats}>

                        <strong
                            style={
                                styles.statNumber
                            }
                        >
                            {tickets.length}
                        </strong>

                        <span>
                            Assigned Tickets
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


                <h2
                    style={
                        styles.sectionTitle
                    }
                >
                    My Assigned Tickets
                </h2>


                {/* ==================================================
                    NO TICKETS
                ================================================== */}

                {tickets.length === 0 ? (

                    <div style={styles.empty}>

                        <div style={styles.emptyIcon}>
                            🎫
                        </div>

                        <h2>
                            No tickets assigned
                        </h2>

                        <p>
                            New tickets assigned
                            to you will appear here.
                        </p>

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
                                        CUSTOMER + DEPARTMENT
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
                                                Customer
                                            </strong>


                                            <p
                                                style={
                                                    styles.infoText
                                                }
                                            >
                                                {
                                                    ticket
                                                        .createdBy
                                                        ?.name ||
                                                    "Unknown"
                                                }
                                            </p>


                                            <small
                                                style={
                                                    styles.email
                                                }
                                            >
                                                {
                                                    ticket
                                                        .createdBy
                                                        ?.email ||
                                                    ""
                                                }
                                            </small>

                                        </div>


                                        <div>

                                            <strong
                                                style={
                                                    styles.infoTitle
                                                }
                                            >
                                                AI Department
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
                                                    "Not specified"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        AI ANALYSIS
                                    ================================================== */}

                                    {ticket.aiAnalysis && (

                                        <div
                                            style={
                                                styles.aiBox
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.aiHeader
                                                }
                                            >

                                                <h3
                                                    style={
                                                        styles.aiTitle
                                                    }
                                                >
                                                    🤖 AI Analysis
                                                </h3>

                                            </div>


                                            <div
                                                style={
                                                    styles.aiDetails
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.aiItem
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.aiLabel
                                                        }
                                                    >
                                                        Category
                                                    </span>

                                                    <strong>
                                                        {
                                                            ticket
                                                                .aiAnalysis
                                                                .category ||
                                                            ticket.category ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </div>


                                                <div
                                                    style={
                                                        styles.aiItem
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.aiLabel
                                                        }
                                                    >
                                                        Priority
                                                    </span>

                                                    <strong>
                                                        {
                                                            ticket
                                                                .aiAnalysis
                                                                .priority ||
                                                            ticket.priority ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {ticket
                                                .aiAnalysis
                                                .intent && (

                                                <p>

                                                    <strong>
                                                        Intent:
                                                    </strong>{" "}

                                                    {
                                                        ticket
                                                            .aiAnalysis
                                                            .intent
                                                    }

                                                </p>

                                            )}


                                            {ticket
                                                .aiAnalysis
                                                .summary && (

                                                <p>

                                                    <strong>
                                                        Summary:
                                                    </strong>{" "}

                                                    {
                                                        ticket
                                                            .aiAnalysis
                                                            .summary
                                                    }

                                                </p>

                                            )}


                                            {/* ==================================================
                                                AI RECOMMENDED SOLUTION ⭐
                                            ================================================== */}

                                            {ticket
                                                .aiAnalysis
                                                .recommendedSolution && (

                                                <div
                                                    style={
                                                        styles.solutionBox
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.solutionHeader
                                                        }
                                                    >

                                                        <div>

                                                            <div
                                                                style={
                                                                    styles.solutionLabel
                                                                }
                                                            >
                                                                ✨ AI ASSIST
                                                            </div>

                                                            <h3
                                                                style={
                                                                    styles.solutionTitle
                                                                }
                                                            >
                                                                💡 Recommended Solution
                                                            </h3>

                                                        </div>


                                                        {ticket
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
                                                                {
                                                                    ticket
                                                                        .aiAnalysis
                                                                        .solutionConfidence
                                                                        .toUpperCase()
                                                                }{" "}
                                                                CONFIDENCE
                                                            </span>

                                                        )}

                                                    </div>


                                                    {/* ==================================================
                                                        RECOMMENDED ACTION
                                                    ================================================== */}

                                                    <div
                                                        style={
                                                            styles.actionRecommendation
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.recommendationIcon
                                                            }
                                                        >
                                                            🎯
                                                        </div>


                                                        <div
                                                            style={
                                                                styles.recommendationBody
                                                            }
                                                        >

                                                            <strong
                                                                style={
                                                                    styles.recommendationHeading
                                                                }
                                                            >
                                                                Recommended Action
                                                            </strong>


                                                            <p
                                                                style={
                                                                    styles.recommendationText
                                                                }
                                                            >
                                                                {
                                                                    ticket
                                                                        .aiAnalysis
                                                                        .recommendedAction ||
                                                                    "Review the ticket and investigate the reported issue."
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* ==================================================
                                                        SOLUTION
                                                    ================================================== */}

                                                    <div
                                                        style={
                                                            styles.solutionContent
                                                        }
                                                    >

                                                        <strong
                                                            style={
                                                                styles.recommendationHeading
                                                            }
                                                        >
                                                            🔎 Solution / Investigation Steps
                                                        </strong>


                                                        <p
                                                            style={
                                                                styles.recommendationText
                                                            }
                                                        >
                                                            {
                                                                ticket
                                                                    .aiAnalysis
                                                                    .recommendedSolution
                                                            }
                                                        </p>

                                                    </div>


                                                    {/* ==================================================
                                                        USE AI RECOMMENDATION
                                                    ================================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            useAIRecommendation(
                                                                ticket
                                                            )
                                                        }
                                                        style={
                                                            styles.useAIButton
                                                        }
                                                    >
                                                        ✨ Use AI Recommendation
                                                    </button>


                                                    <p
                                                        style={
                                                            styles.aiDisclaimer
                                                        }
                                                    >
                                                        AI-generated guidance.
                                                        Review and edit it before
                                                        sending to the customer.
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    )}


                                    {/* ==================================================
                                        COMMENTS
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
                                                💬 Customer Conversation
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

                                            {(
                                                ticket.comments ||
                                                []
                                            ).length === 0 ? (

                                                <div
                                                    style={
                                                        styles.noComments
                                                    }
                                                >
                                                    No messages yet.
                                                    Start the conversation
                                                    with the customer.
                                                </div>

                                            ) : (

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
                                                            commentAuthorId?.toString() ===
                                                            currentUserId?.toString();


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

                                            )}

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
                                                id={`comment-${ticket._id}`}
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
                                                placeholder="Reply to customer... Press Enter to send"
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

                                                    ...(sendingComment ===
                                                        ticket._id ||
                                                        !commentText[
                                                            ticket._id
                                                        ]?.trim()
                                                        ? styles.sendDisabled
                                                        : {})
                                                }}
                                            >
                                                {
                                                    sendingComment ===
                                                    ticket._id
                                                        ? "Sending..."
                                                        : "Send Reply"
                                                }
                                            </button>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        STATUS ACTIONS
                                    ================================================== */}

                                    <div
                                        style={
                                            styles.actions
                                        }
                                    >

                                        <button
                                            style={{
                                                ...styles.actionButton,
                                                ...styles.openButton,

                                                ...(ticket.status ===
                                                "open"
                                                    ? styles.activeButton
                                                    : {})
                                            }}
                                            disabled={
                                                updatingTicket ===
                                                ticket._id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    ticket._id,
                                                    "open"
                                                )
                                            }
                                        >
                                            {
                                                updatingTicket ===
                                                ticket._id
                                                    ? "Updating..."
                                                    : "Open"
                                            }
                                        </button>


                                        <button
                                            style={{
                                                ...styles.actionButton,
                                                ...styles.progressButton,

                                                ...(ticket.status ===
                                                "in-progress"
                                                    ? styles.activeButton
                                                    : {})
                                            }}
                                            disabled={
                                                updatingTicket ===
                                                ticket._id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    ticket._id,
                                                    "in-progress"
                                                )
                                            }
                                        >
                                            {
                                                updatingTicket ===
                                                ticket._id
                                                    ? "Updating..."
                                                    : "In Progress"
                                            }
                                        </button>


                                        <button
                                            style={{
                                                ...styles.actionButton,
                                                ...styles.resolveButton,

                                                ...(ticket.status ===
                                                "resolved"
                                                    ? styles.activeButton
                                                    : {})
                                            }}
                                            disabled={
                                                updatingTicket ===
                                                ticket._id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    ticket._id,
                                                    "resolved"
                                                )
                                            }
                                        >
                                            {
                                                updatingTicket ===
                                                ticket._id
                                                    ? "Updating..."
                                                    : "Resolve"
                                            }
                                        </button>

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
        fontSize: "38px",
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
        marginBottom: "40px",
        gap: "30px"
    },


    heading: {
        margin: 0,
        fontSize: "32px"
    },


    headerText: {
        color: "#6b7280",
        fontSize: "16px",
        marginTop: "8px",
        maxWidth: "650px",
        lineHeight: "1.5"
    },


    stats: {
        minWidth: "150px",
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


    sectionTitle: {
        marginBottom: "20px"
    },


    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "20px"
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
        fontSize: "42px",
        marginBottom: "10px"
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


    statusDefault: {
        background: "#e5e7eb",
        color: "#374151"
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
        borderTop: "1px solid #e5e7eb",
        margin: "20px 0"
    },


    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },


    infoTitle: {
        fontSize: "14px"
    },


    infoText: {
        margin: "6px 0 2px",
        fontSize: "15px"
    },


    email: {
        color: "#6b7280"
    },


    // ==================================================
    // AI ANALYSIS
    // ==================================================

    aiBox: {
        marginTop: "22px",
        padding: "18px",
        background: "#f5f3ff",
        borderRadius: "12px",
        color: "#374151",
        fontSize: "14px",
        lineHeight: "1.5"
    },


    aiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },


    aiTitle: {
        marginTop: 0,
        color: "#6d28d9",
        marginBottom: "15px"
    },


    aiDetails: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "10px",
        marginBottom: "10px"
    },


    aiItem: {
        background: "white",
        padding: "10px 12px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "3px"
    },


    aiLabel: {
        color: "#6b7280",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.04em"
    },


    // ==================================================
    // AI RECOMMENDED SOLUTION
    // ==================================================

    solutionBox: {
        marginTop: "20px",
        padding: "18px",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #ddd6fe",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.04)"
    },


    solutionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "16px"
    },


    solutionLabel: {
        color: "#8b5cf6",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        marginBottom: "3px"
    },


    solutionTitle: {
        margin: 0,
        color: "#5b21b6",
        fontSize: "18px"
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


    actionRecommendation: {
        display: "flex",
        gap: "12px",
        padding: "13px",
        background: "#f5f3ff",
        borderRadius: "9px",
        marginBottom: "12px"
    },


    recommendationIcon: {
        fontSize: "20px",
        flexShrink: 0
    },


    recommendationBody: {
        flex: 1,
        minWidth: 0
    },


    recommendationHeading: {
        display: "block",
        color: "#374151",
        fontSize: "13px"
    },


    recommendationText: {
        margin: "6px 0 0",
        color: "#4b5563",
        lineHeight: "1.6",
        whiteSpace: "pre-line"
    },


    solutionContent: {
        padding: "13px",
        background: "#fafafa",
        borderRadius: "9px"
    },


    // ==================================================
    // USE AI BUTTON
    // ==================================================

    useAIButton: {
        width: "100%",
        marginTop: "14px",
        padding: "12px 16px",
        border: "none",
        borderRadius: "9px",
        background: "#6d28d9",
        color: "white",
        fontWeight: "700",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s ease"
    },


    aiDisclaimer: {
        margin: "12px 0 0",
        fontSize: "11px",
        color: "#9ca3af",
        fontStyle: "italic"
    },


    // ==================================================
    // COMMENTS
    // ==================================================

    commentsSection: {
        marginTop: "25px",
        borderTop: "1px solid #e5e7eb",
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
        maxHeight: "150px",
        resize: "vertical",
        padding: "11px",
        border: "1px solid #d1d5db",
        borderRadius: "9px",
        fontSize: "14px",
        boxSizing: "border-box",
        fontFamily: "inherit",
        lineHeight: "1.5"
    },


    sendButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "9px",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap"
    },


    sendDisabled: {
        opacity: 0.5,
        cursor: "not-allowed"
    },


    // ==================================================
    // STATUS ACTIONS
    // ==================================================

    actions: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr 1fr",
        gap: "10px",
        marginTop: "24px"
    },


    actionButton: {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    openButton: {
        background: "#fee2e2",
        color: "#991b1b"
    },


    progressButton: {
        background: "#fef3c7",
        color: "#92400e"
    },


    resolveButton: {
        background: "#dcfce7",
        color: "#166534"
    },


    activeButton: {
        outline: "3px solid #d1d5db"
    }

};


export default AgentDashboard;
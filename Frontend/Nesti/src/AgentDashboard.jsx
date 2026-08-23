import { useEffect, useState } from "react";

import api from "./services/api";


function AgentDashboard({ user, onLogout }) {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingTicket, setUpdatingTicket] = useState(null);
    const [error, setError] = useState("");


    // ========================================
    // FETCH ASSIGNED TICKETS
    // ========================================

    useEffect(() => {

        const fetchTickets = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/agent/tickets");

                setTickets(
                    response.data.tickets || []
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load tickets"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchTickets();

    }, []);


    // ========================================
    // UPDATE STATUS
    // ========================================

    const updateStatus = async (
        ticketId,
        status
    ) => {

        try {

            setUpdatingTicket(ticketId);
            setError("");

            const response =
                await api.patch(
                    `/agent/tickets/${ticketId}/status`,
                    {
                        status
                    }
                );


            if (response.data.ticket) {

                setTickets((previousTickets) =>

                    previousTickets.map(
                        (ticket) =>

                            ticket._id === ticketId
                                ? response.data.ticket
                                : ticket
                    )

                );

            } else {

                setTickets((previousTickets) =>

                    previousTickets.map(
                        (ticket) =>

                            ticket._id === ticketId
                                ? {
                                      ...ticket,
                                      status
                                  }
                                : ticket
                    )

                );

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update ticket status"
            );

        } finally {

            setUpdatingTicket(null);

        }

    };


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (status) => {

        if (status === "open") {

            return styles.statusOpen;

        }

        if (status === "in-progress") {

            return styles.statusProgress;

        }

        if (status === "resolved") {

            return styles.statusResolved;

        }

        return styles.statusDefault;

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div style={styles.center}>

                <h2>
                    Loading tickets...
                </h2>

            </div>
        );

    }


    // ========================================
    // DASHBOARD
    // ========================================

    return (

        <div style={styles.page}>


            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <nav style={styles.navbar}>


                {/* LOGO */}

                <div>

                    <h2 style={styles.logo}>
                        Nesti
                    </h2>

                    <p style={styles.subtitle}>
                        AI-powered customer support
                    </p>

                </div>


                {/* USER + LOGOUT */}

                <div style={styles.navRight}>


                    <div style={styles.userInfo}>

                        <strong>
                            {user?.name || "Agent"}
                        </strong>

                        <span>
                            {user?.email || ""}
                        </span>

                    </div>


                    <button
                        onClick={onLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>


                </div>

            </nav>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main style={styles.container}>


                {/* HEADER */}

                <div style={styles.header}>


                    <div>

                        <h1 style={styles.heading}>
                            Agent Dashboard 👋
                        </h1>

                        <p style={styles.headerText}>
                            Manage your assigned customer tickets.
                        </p>

                    </div>


                    <div style={styles.stats}>

                        <strong style={styles.statNumber}>
                            {tickets.length}
                        </strong>

                        <span>
                            Assigned Tickets
                        </span>

                    </div>


                </div>


                {/* ERROR */}

                {error && (

                    <div style={styles.error}>

                        {error}

                    </div>

                )}


                {/* TICKET TITLE */}

                <h2 style={styles.sectionTitle}>
                    My Assigned Tickets
                </h2>


                {/* ================================= */}
                {/* NO TICKETS */}
                {/* ================================= */}

                {tickets.length === 0 ? (

                    <div style={styles.empty}>

                        <h2>
                            No tickets assigned
                        </h2>

                        <p>
                            New tickets assigned to you
                            will appear here.
                        </p>

                    </div>

                ) : (


                    /* ================================= */
                    /* TICKET GRID */
                    /* ================================= */

                    <div style={styles.ticketGrid}>


                        {tickets.map((ticket) => (

                            <div
                                key={ticket._id}
                                style={styles.ticket}
                            >


                                {/* TICKET TOP */}

                                <div style={styles.ticketTop}>


                                    <h2 style={styles.ticketTitle}>
                                        {ticket.title}
                                    </h2>


                                    <span
                                        style={{
                                            ...styles.status,
                                            ...getStatusStyle(
                                                ticket.status
                                            )
                                        }}
                                    >
                                        {ticket.status}
                                    </span>


                                </div>


                                {/* DESCRIPTION */}

                                <p style={styles.description}>
                                    {ticket.description}
                                </p>


                                {/* TAGS */}

                                <div style={styles.tags}>


                                    <span
                                        style={styles.category}
                                    >
                                        {ticket.category ||
                                            "General"}
                                    </span>


                                    <span
                                        style={styles.priority}
                                    >
                                        {ticket.priority ||
                                            "medium"}
                                    </span>


                                </div>


                                <hr style={styles.line} />


                                {/* CUSTOMER + DEPARTMENT */}

                                <div style={styles.infoGrid}>


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
                                                ticket.createdBy
                                                    ?.name ||
                                                "Unknown"
                                            }
                                        </p>


                                        <small
                                            style={styles.email}
                                        >
                                            {
                                                ticket.createdBy
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
                                                ticket.aiAnalysis
                                                    ?.suggestedDepartment ||
                                                "Not specified"
                                            }
                                        </p>

                                    </div>


                                </div>


                                {/* ================================= */}
                                {/* AI ANALYSIS */}
                                {/* ================================= */}

                                {ticket.aiAnalysis && (

                                    <div style={styles.aiBox}>


                                        <h3
                                            style={
                                                styles.aiTitle
                                            }
                                        >
                                            🤖 AI Analysis
                                        </h3>


                                        <p>

                                            <strong>
                                                Category:
                                            </strong>{" "}

                                            {
                                                ticket.aiAnalysis
                                                    .category ||
                                                ticket.category ||
                                                "N/A"
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Priority:
                                            </strong>{" "}

                                            {
                                                ticket.aiAnalysis
                                                    .priority ||
                                                ticket.priority ||
                                                "N/A"
                                            }

                                        </p>


                                        {ticket.aiAnalysis.intent && (

                                            <p>

                                                <strong>
                                                    Intent:
                                                </strong>{" "}

                                                {
                                                    ticket.aiAnalysis
                                                        .intent
                                                }

                                            </p>

                                        )}


                                        {ticket.aiAnalysis.summary && (

                                            <p>

                                                <strong>
                                                    Summary:
                                                </strong>{" "}

                                                {
                                                    ticket.aiAnalysis
                                                        .summary
                                                }

                                            </p>

                                        )}


                                    </div>

                                )}


                                {/* ================================= */}
                                {/* STATUS BUTTONS */}
                                {/* ================================= */}

                                <div style={styles.actions}>


                                    {/* OPEN */}

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
                                        {updatingTicket ===
                                        ticket._id
                                            ? "Updating..."
                                            : "Open"}
                                    </button>


                                    {/* IN PROGRESS */}

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
                                        {updatingTicket ===
                                        ticket._id
                                            ? "Updating..."
                                            : "In Progress"}
                                    </button>


                                    {/* RESOLVE */}

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
                                        {updatingTicket ===
                                        ticket._id
                                            ? "Updating..."
                                            : "Resolve"}
                                    </button>


                                </div>


                            </div>

                        ))}


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

        background: "#f5f7fb",

        color: "#1f2937"

    },


    // ==========================================
    // NAVBAR
    // ==========================================

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


    // ==========================================
    // MAIN
    // ==========================================

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

        marginTop: "8px"

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


    // ==========================================
    // TICKETS
    // ==========================================

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


    ticketTitle: {

        margin: 0,

        fontSize: "21px"

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

        background: "#fee2e2",

        color: "#b91c1c",

        padding: "6px 10px",

        borderRadius: "6px",

        fontSize: "12px",

        fontWeight: "600"

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


    // ==========================================
    // AI
    // ==========================================

    aiBox: {

        marginTop: "22px",

        padding: "18px",

        background: "#f5f3ff",

        borderRadius: "10px",

        color: "#374151",

        fontSize: "14px",

        lineHeight: "1.5"

    },


    aiTitle: {

        marginTop: 0,

        color: "#6d28d9"

    },


    // ==========================================
    // ACTIONS
    // ==========================================

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

        fontWeight: "600",

        transition: "0.2s"

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
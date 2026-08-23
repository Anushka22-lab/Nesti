import { useEffect, useState } from "react";
import api from "./services/api";

function AdminDashboard({ user, onLogout }) {
    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [assigning, setAssigning] = useState(null);

    // =========================================
    // FETCH TICKETS
    // =========================================

    const fetchTickets = async () => {
        try {
            const response = await api.get("/tickets/all");

            console.log("ADMIN TICKETS:", response.data);

            setTickets(response.data.tickets || []);

        } catch (error) {
            console.log(
                "Tickets error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load tickets"
            );
        }
    };


    // =========================================
    // FETCH AGENTS
    // =========================================

    const fetchAgents = async () => {
        try {

            // IMPORTANT:
            // Backend route is /api/agent/agents
            const response = await api.get("/agent/agents");

            console.log("AGENTS:", response.data);

            setAgents(response.data.agents || []);

        } catch (error) {

            console.log(
                "Agents error:",
                error.response?.data || error.message
            );

            setAgents([]);

            setMessage(
                error.response?.data?.message ||
                "Failed to load agents"
            );
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchTickets(),
                fetchAgents()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    // =========================================
    // ASSIGN TICKET
    // =========================================

    const assignTicket = async (ticketId, agentId) => {

        if (!agentId) {
            return;
        }

        try {

            setAssigning(ticketId);
            setMessage("");

            console.log(
                "Assigning:",
                ticketId,
                "to:",
                agentId
            );

            const response = await api.patch(
                `/tickets/${ticketId}/assign`,
                {
                    assignedTo: agentId
                }
            );

            console.log(
                "ASSIGN RESPONSE:",
                response.data
            );

            setMessage(
                "Ticket assigned successfully 🎉"
            );

            await fetchTickets();

        } catch (error) {

            console.log(
                "Assignment error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to assign ticket"
            );

        } finally {

            setAssigning(null);

        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <h2>
                        Loading Admin Dashboard...
                    </h2>

                    <p>
                        Fetching tickets and agents
                    </p>

                </div>

            </div>
        );

    }


    // =========================================
    // DASHBOARD
    // =========================================

    return (

        <div style={styles.page}>

            {/* ================= NAVBAR ================= */}

            <nav style={styles.navbar}>

                <div>

                    <h2 style={{ margin: 0 }}>
                        Nesti
                    </h2>

                    <small>
                        AI-powered customer support
                    </small>

                </div>


                <div style={styles.navRight}>

                    <div style={styles.adminInfo}>

                        <strong>
                            Admin 👑
                        </strong>

                        <small>
                            {user?.email}
                        </small>

                    </div>


                    <button
                        onClick={onLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ================= MAIN ================= */}

            <main style={styles.container}>

                {/* HEADER */}

                <div style={styles.header}>

                    <div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Manage customer tickets and assign them
                            to support agents.
                        </p>

                    </div>


                    <div style={styles.stats}>

                        <strong>
                            {tickets.length}
                        </strong>

                        <span>
                            Total Tickets
                        </span>

                    </div>

                </div>


                {/* MESSAGE */}

                {message && (

                    <div style={styles.message}>

                        {message}

                    </div>

                )}


                {/* AGENT COUNT */}

                <div style={styles.agentInfo}>

                    <strong>
                        Available Agents:
                    </strong>

                    <span>
                        {agents.length}
                    </span>

                </div>


                <h2 style={{ marginTop: "30px" }}>
                    All Customer Tickets
                </h2>


                {/* ================= NO TICKETS ================= */}

                {tickets.length === 0 ? (

                    <div style={styles.empty}>

                        <h3>
                            No tickets found.
                        </h3>

                        <p>
                            Customer tickets will appear here.
                        </p>

                        <button
                            onClick={async () => {

                                await fetchTickets();
                                await fetchAgents();

                            }}
                            style={styles.refreshButton}
                        >
                            Refresh
                        </button>

                    </div>

                ) : (

                    /* ================= TICKETS ================= */

                    <div style={styles.grid}>

                        {tickets.map((ticket) => (

                            <div
                                key={ticket._id}
                                style={styles.ticket}
                            >

                                {/* TITLE + STATUS */}

                                <div style={styles.ticketTop}>

                                    <h2 style={{ marginTop: 0 }}>
                                        {ticket.title}
                                    </h2>


                                    <span
                                        style={{
                                            ...styles.status,
                                            background:
                                                getStatusColor(
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

                                    <span style={styles.category}>
                                        {ticket.category}
                                    </span>

                                    <span style={styles.priority}>
                                        {ticket.priority}
                                    </span>

                                </div>


                                <hr />


                                {/* CUSTOMER + AI */}

                                <div style={styles.infoRow}>

                                    <div>

                                        <strong>
                                            Customer
                                        </strong>

                                        <p>
                                            {ticket.createdBy?.name ||
                                                "Unknown"}
                                        </p>

                                        <small>
                                            {ticket.createdBy?.email ||
                                                "No email"}
                                        </small>

                                    </div>


                                    <div>

                                        <strong>
                                            AI Department
                                        </strong>

                                        <p>
                                            {ticket.aiAnalysis
                                                ?.suggestedDepartment ||
                                                "Not available"}
                                        </p>

                                    </div>

                                </div>


                                {/* ================= ASSIGNMENT ================= */}

                                <div style={styles.assignment}>

                                    <strong>
                                        Assigned Agent
                                    </strong>


                                    {ticket.assignedTo ? (

                                        <div style={styles.currentAgent}>

                                            <span>
                                                ✓{" "}
                                                {ticket.assignedTo.name ||
                                                    "Assigned"}
                                            </span>

                                            <small>
                                                {ticket.assignedTo.department ||
                                                    "Support Agent"}
                                            </small>

                                        </div>

                                    ) : (

                                        <p style={styles.notAssigned}>
                                            Not assigned yet
                                        </p>

                                    )}


                                    {/* AGENT DROPDOWN */}

                                    <label style={styles.label}>
                                        Assign / Change Agent
                                    </label>


                                    <select

                                        value={
                                            ticket.assignedTo?._id ||
                                            ticket.assignedTo ||
                                            ""
                                        }

                                        onChange={(e) =>
                                            assignTicket(
                                                ticket._id,
                                                e.target.value
                                            )
                                        }

                                        disabled={
                                            assigning === ticket._id
                                        }

                                        style={styles.select}
                                    >

                                        <option value="">
                                            Select an agent
                                        </option>


                                        {agents.map((agent) => (

                                            <option
                                                key={agent._id}
                                                value={agent._id}
                                            >

                                                {agent.name}

                                                {agent.department
                                                    ? ` - ${agent.department}`
                                                    : ""}

                                            </option>

                                        ))}

                                    </select>


                                    {assigning === ticket._id && (

                                        <small
                                            style={
                                                styles.assigningText
                                            }
                                        >
                                            Assigning ticket...
                                        </small>

                                    )}

                                </div>


                                {/* ================= AI ANALYSIS ================= */}

                                {ticket.aiAnalysis && (

                                    <div style={styles.aiBox}>

                                        <h3>
                                            🤖 AI Analysis
                                        </h3>


                                        <p>

                                            <strong>
                                                Category:
                                            </strong>{" "}

                                            {ticket.aiAnalysis.category ||
                                                "N/A"}

                                        </p>


                                        <p>

                                            <strong>
                                                Priority:
                                            </strong>{" "}

                                            {ticket.aiAnalysis.priority ||
                                                "N/A"}

                                        </p>


                                        <p>

                                            <strong>
                                                Intent:
                                            </strong>{" "}

                                            {ticket.aiAnalysis.intent ||
                                                "N/A"}

                                        </p>


                                        <p>

                                            <strong>
                                                Summary:
                                            </strong>{" "}

                                            {ticket.aiAnalysis.summary ||
                                                "N/A"}

                                        </p>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}


// =========================================
// STATUS COLOR
// =========================================

function getStatusColor(status) {

    if (status === "open") {
        return "#fee2e2";
    }

    if (status === "in-progress") {
        return "#fef3c7";
    }

    if (status === "resolved") {
        return "#dcfce7";
    }

    return "#e5e7eb";
}


// =========================================
// STYLES
// =========================================

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
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)"
    },

    navbar: {
        minHeight: "70px",
        padding: "0 40px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.05)"
    },

    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },

    adminInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "3px"
    },

    logoutButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        background: "#111827",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    container: {
        maxWidth: "1200px",
        margin: "auto",
        padding: "40px 25px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },

    stats: {
        background: "white",
        padding: "20px 35px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },

    agentInfo: {
        display: "inline-flex",
        gap: "10px",
        padding: "10px 15px",
        background: "white",
        borderRadius: "8px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.05)"
    },

    message: {
        padding: "15px",
        margin: "20px 0",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
        textAlign: "center"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "20px"
    },

    ticket: {
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },

    ticketTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },

    status: {
        height: "fit-content",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },

    description: {
        color: "#6b7280",
        lineHeight: "1.6"
    },

    tags: {
        display: "flex",
        gap: "10px",
        margin: "15px 0"
    },

    category: {
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px"
    },

    priority: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px"
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "30px",
        margin: "20px 0",
        fontSize: "14px"
    },

    assignment: {
        marginTop: "20px",
        padding: "18px",
        background: "#f9fafb",
        borderRadius: "10px"
    },

    currentAgent: {
        marginTop: "10px",
        padding: "10px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "3px"
    },

    notAssigned: {
        color: "#6b7280",
        margin: "8px 0 15px"
    },

    label: {
        display: "block",
        marginTop: "15px",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600"
    },

    select: {
        width: "100%",
        padding: "11px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        background: "white",
        cursor: "pointer",
        boxSizing: "border-box"
    },

    assigningText: {
        display: "block",
        marginTop: "8px",
        color: "#6b7280"
    },

    aiBox: {
        marginTop: "20px",
        padding: "20px",
        background: "#f5f3ff",
        borderRadius: "10px"
    },

    empty: {
        background: "white",
        padding: "50px",
        textAlign: "center",
        borderRadius: "12px"
    },

    refreshButton: {
        marginTop: "15px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        background: "#111827",
        color: "white",
        cursor: "pointer"
    }
};

export default AdminDashboard;
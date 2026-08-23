import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "./services/api";

const SOCKET_URL = "http://localhost:5000";

function CustomerDashboard({ user, onLogout }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // ========================================
    // FETCH TICKETS
    // ========================================

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tickets/my");

            setTickets(response.data.tickets || []);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load your tickets"
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // INITIAL FETCH
    // ========================================

    useEffect(() => {
        fetchTickets();
    }, []);

    // ========================================
    // SOCKET.IO
    // ========================================

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            withCredentials: true
        });

        socket.on("connect", () => {
            console.log(
                "Customer Socket connected:",
                socket.id
            );

            // Join all current ticket rooms
            tickets.forEach((ticket) => {
                socket.emit(
                    "joinTicket",
                    ticket._id
                );
            });
        });

        socket.on(
            "ticketStatusUpdated",
            (data) => {

                console.log(
                    "Ticket status updated:",
                    data
                );

                setTickets((previousTickets) =>
                    previousTickets.map((ticket) =>
                        ticket._id === data.ticketId
                            ? {
                                  ...ticket,
                                  status: data.status
                              }
                            : ticket
                    )
                );
            }
        );

        socket.on(
            "socketError",
            (data) => {
                console.error(
                    "Socket error:",
                    data
                );
            }
        );

        socket.on("disconnect", () => {
            console.log(
                "Customer Socket disconnected"
            );
        });

        return () => {
            socket.disconnect();
        };

    }, [tickets.length]);

    // ========================================
    // CREATE TICKET
    // ========================================

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        if (
            !title.trim() ||
            !description.trim()
        ) {
            setError(
                "Please enter both title and description"
            );
            return;
        }

        try {
            setCreating(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/tickets",
                {
                    title: title.trim(),
                    description: description.trim()
                }
            );

            if (response.data.ticket) {

                // Fetch populated ticket again
                await fetchTickets();

            } else {

                await fetchTickets();

            }

            setTitle("");
            setDescription("");
            setShowCreateForm(false);

            setSuccess(
                "Ticket created successfully 🎉"
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create ticket"
            );

        } finally {
            setCreating(false);
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
                <div style={styles.loadingCard}>
                    <h2>Loading Nesti...</h2>

                    <p>
                        Fetching your tickets
                    </p>
                </div>
            </div>
        );
    }

    // ========================================
    // DASHBOARD
    // ========================================

    return (
        <div style={styles.page}>

            {/* NAVBAR */}

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
                            {user?.name || "Customer"}
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

            {/* MAIN */}

            <main style={styles.container}>

                <div style={styles.header}>

                    <div>
                        <h1 style={styles.heading}>
                            Welcome,{" "}
                            {user?.name || "Customer"} 👋
                        </h1>

                        <p style={styles.headerText}>
                            Create and track your support tickets.
                        </p>
                    </div>

                    <div style={styles.stats}>

                        <strong style={styles.statNumber}>
                            {tickets.length}
                        </strong>

                        <span>
                            My Tickets
                        </span>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div style={styles.success}>
                        {success}
                    </div>
                )}

                {/* CREATE HEADER */}

                <div style={styles.createHeader}>

                    <h2 style={styles.sectionTitle}>
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
                        style={styles.createButton}
                    >
                        {showCreateForm
                            ? "Close"
                            : "+ Create Ticket"}
                    </button>

                </div>

                {/* CREATE FORM */}

                {showCreateForm && (

                    <form
                        onSubmit={handleCreateTicket}
                        style={styles.form}
                    >

                        <h2>
                            Create New Ticket
                        </h2>

                        <label style={styles.label}>
                            Ticket Title
                        </label>

                        <input
                            type="text"
                            placeholder="Example: College website is not opening"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            style={styles.input}
                        />

                        <label style={styles.label}>
                            Description
                        </label>

                        <textarea
                            placeholder="Explain your problem..."
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            style={styles.textarea}
                        />

                        <button
                            type="submit"
                            disabled={creating}
                            style={{
                                ...styles.submitButton,
                                ...(creating
                                    ? styles.disabledButton
                                    : {})
                            }}
                        >
                            {creating
                                ? "Creating..."
                                : "Submit Ticket"}
                        </button>

                    </form>
                )}

                {/* NO TICKETS */}

                {tickets.length === 0 ? (

                    <div style={styles.empty}>

                        <div style={styles.emptyIcon}>
                            🎫
                        </div>

                        <h2>
                            No tickets yet
                        </h2>

                        <p>
                            Create your first support ticket
                            and our team will help you.
                        </p>

                    </div>

                ) : (

                    <div style={styles.ticketGrid}>

                        {tickets.map((ticket) => (

                            <div
                                key={ticket._id}
                                style={styles.ticket}
                            >

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

                                <p style={styles.description}>
                                    {ticket.description}
                                </p>

                                <div style={styles.tags}>

                                    <span style={styles.category}>
                                        {ticket.category ||
                                            "Pending AI"}
                                    </span>

                                    <span style={styles.priority}>
                                        {ticket.priority ||
                                            "medium"}
                                    </span>

                                </div>

                                <hr style={styles.line} />

                                <div style={styles.infoGrid}>

                                    <div>

                                        <strong>
                                            Assigned Agent
                                        </strong>

                                        <p style={styles.infoText}>
                                            {ticket.assignedTo?.name ||
                                                "Not assigned yet"}
                                        </p>

                                        {ticket.assignedTo?.email && (
                                            <small style={styles.email}>
                                                {ticket.assignedTo.email}
                                            </small>
                                        )}

                                    </div>

                                    <div>

                                        <strong>
                                            Department
                                        </strong>

                                        <p style={styles.infoText}>
                                            {ticket.aiAnalysis
                                                ?.suggestedDepartment ||
                                                "Being analyzed"}
                                        </p>

                                    </div>

                                </div>

                                {ticket.aiAnalysis && (

                                    <div style={styles.aiBox}>

                                        <h3 style={styles.aiTitle}>
                                            🤖 AI Analysis
                                        </h3>

                                        {ticket.aiAnalysis.category && (
                                            <p>
                                                <strong>
                                                    Category:
                                                </strong>{" "}
                                                {
                                                    ticket.aiAnalysis
                                                        .category
                                                }
                                            </p>
                                        )}

                                        {ticket.aiAnalysis.priority && (
                                            <p>
                                                <strong>
                                                    Priority:
                                                </strong>{" "}
                                                {
                                                    ticket.aiAnalysis
                                                        .priority
                                                }
                                            </p>
                                        )}

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

                                <div style={styles.date}>
                                    Created:{" "}
                                    {ticket.createdAt
                                        ? new Date(
                                              ticket.createdAt
                                          ).toLocaleString()
                                        : "N/A"}
                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}

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
        borderRadius: "14px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)"
    },

    label: {
        display: "block",
        marginTop: "18px",
        marginBottom: "7px",
        fontWeight: "600",
        fontSize: "14px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px"
    },

    textarea: {
        width: "100%",
        minHeight: "130px",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        resize: "vertical"
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
        borderRadius: "14px"
    },

    emptyIcon: {
        fontSize: "45px"
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

    ticketTitle: {
        margin: 0,
        fontSize: "21px"
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
        gap: "20px",
        fontSize: "14px"
    },

    infoText: {
        margin: "7px 0 2px",
        color: "#6b7280"
    },

    email: {
        color: "#9ca3af"
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

    date: {
        marginTop: "20px",
        color: "#9ca3af",
        fontSize: "12px"
    }
};

export default CustomerDashboard;
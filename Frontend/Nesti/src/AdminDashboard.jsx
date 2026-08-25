import { useEffect, useMemo, useState } from "react";
import api from "./services/api";

function AdminDashboard({ user, onLogout }) {

    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);

    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [assigning, setAssigning] = useState(null);

    // ========================================
    // FILTER STATES
    // ========================================

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [categoryFilter, setCategoryFilter] =
        useState("all");

    const [agentFilter, setAgentFilter] =
        useState("all");


    // ========================================
    // FETCH TICKETS
    // ========================================

    const fetchTickets = async () => {

        try {

            const response =
                await api.get("/tickets/all");

            console.log(
                "ADMIN TICKETS:",
                response.data
            );

            setTickets(
                response.data.tickets || []
            );

        } catch (error) {

            console.log(
                "Tickets error:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load tickets"
            );

        }

    };


    // ========================================
    // FETCH AGENTS
    // ========================================

    const fetchAgents = async () => {

        try {

            const response =
                await api.get("/agent/agents");

            console.log(
                "AGENTS:",
                response.data
            );

            setAgents(
                response.data.agents || []
            );

        } catch (error) {

            console.log(
                "Agents error:",
                error.response?.data ||
                error.message
            );

            setAgents([]);

            setMessage(
                error.response?.data?.message ||
                "Failed to load agents"
            );

        }

    };


    // ========================================
    // FETCH ANALYTICS
    // ========================================

    const fetchAnalytics = async () => {

        try {

            const response =
                await api.get("/tickets/analytics");

            console.log(
                "ANALYTICS:",
                response.data
            );

            setAnalytics(response.data);

        } catch (error) {

            console.log(
                "Analytics error:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load analytics"
            );

        }

    };


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchTickets(),
                fetchAgents(),
                fetchAnalytics()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);


    // ========================================
    // STATS
    // ========================================

    const stats = useMemo(() => {

        return {

            total:
                tickets.length,

            open:
                tickets.filter(
                    ticket =>
                        ticket.status === "open"
                ).length,

            inProgress:
                tickets.filter(
                    ticket =>
                        ticket.status === "in-progress"
                ).length,

            resolved:
                tickets.filter(
                    ticket =>
                        ticket.status === "resolved"
                ).length,

            urgent:
                tickets.filter(
                    ticket =>
                        ticket.priority === "urgent"
                ).length

        };

    }, [tickets]);


    // ========================================
    // FILTERED TICKETS
    // ========================================

    const filteredTickets = useMemo(() => {

        const searchText =
            search
                .trim()
                .toLowerCase();


        return tickets.filter(
            (ticket) => {

                const matchesSearch =
                    !searchText ||

                    ticket.title
                        ?.toLowerCase()
                        .includes(searchText) ||

                    ticket.description
                        ?.toLowerCase()
                        .includes(searchText) ||

                    ticket.createdBy?.name
                        ?.toLowerCase()
                        .includes(searchText) ||

                    ticket.createdBy?.email
                        ?.toLowerCase()
                        .includes(searchText) ||

                    ticket.assignedTo?.name
                        ?.toLowerCase()
                        .includes(searchText);


                const matchesStatus =
                    statusFilter === "all" ||
                    ticket.status === statusFilter;


                const matchesPriority =
                    priorityFilter === "all" ||
                    ticket.priority === priorityFilter;


                const matchesCategory =
                    categoryFilter === "all" ||
                    ticket.category === categoryFilter;


                const matchesAgent =
                    agentFilter === "all" ||
                    ticket.assignedTo?._id ===
                        agentFilter ||
                    ticket.assignedTo ===
                        agentFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesCategory &&
                    matchesAgent
                );

            }
        );

    }, [
        tickets,
        search,
        statusFilter,
        priorityFilter,
        categoryFilter,
        agentFilter
    ]);


    // ========================================
    // CLEAR FILTERS
    // ========================================

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("all");

        setPriorityFilter("all");

        setCategoryFilter("all");

        setAgentFilter("all");

    };


    // ========================================
    // ASSIGN TICKET
    // ========================================

    const assignTicket = async (
        ticketId,
        agentId
    ) => {

        if (!agentId) {
            return;
        }

        try {

            setAssigning(ticketId);

            setMessage("");


            const response =
                await api.patch(
                    `/tickets/${ticketId}/assign`,
                    {
                        agentId
                    }
                );


            console.log(
                "ASSIGN RESPONSE:",
                response.data
            );


            setMessage(
                "Ticket assigned successfully 🎉"
            );


            await Promise.all([
                fetchTickets(),
                fetchAnalytics()
            ]);


        } catch (error) {

            console.log(
                "Assignment error:",
                error.response?.data ||
                error.message
            );


            setMessage(
                error.response?.data?.message ||
                "Failed to assign ticket"
            );


        } finally {

            setAssigning(null);

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <h2>
                        Loading Admin Dashboard...
                    </h2>

                    <p>
                        Fetching tickets,
                        agents and analytics
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // ANALYTICS DATA
    // ========================================

    const priorityStats =
        analytics?.priorityStats || [];

    const categoryStats =
        analytics?.categoryStats || [];

    const agentWorkload =
        analytics?.agentWorkload || [];


    const getStatCount = (
        array,
        name
    ) => {

        const item =
            array.find(
                item =>
                    item._id === name
            );

        return item?.count || 0;

    };


    const maxPriority =
        Math.max(
            ...priorityStats.map(
                item => item.count
            ),
            1
        );


    const maxCategory =
        Math.max(
            ...categoryStats.map(
                item => item.count
            ),
            1
        );


    // ========================================
    // DASHBOARD
    // ========================================

    return (

        <div style={styles.page}>

            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <nav style={styles.navbar}>

                <div>

                    <h2 style={styles.logo}>
                        Nesti
                    </h2>

                    <small style={styles.subtitle}>
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


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main style={styles.container}>

                {/* HEADER */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.heading}>
                            Admin Dashboard
                        </h1>

                        <p style={styles.headerText}>
                            Monitor and manage your
                            customer support system.
                        </p>

                    </div>

                </div>


                {/* ================================= */}
                {/* STAT CARDS */}
                {/* ================================= */}

                <div style={styles.statsGrid}>

                    <StatCard
                        title="Total Tickets"
                        value={stats.total}
                    />

                    <StatCard
                        title="Open"
                        value={stats.open}
                    />

                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                    />

                    <StatCard
                        title="Resolved"
                        value={stats.resolved}
                    />

                    <StatCard
                        title="Urgent"
                        value={stats.urgent}
                    />

                </div>


                {/* MESSAGE */}

                {message && (

                    <div style={styles.message}>
                        {message}
                    </div>

                )}


                {/* ================================= */}
                {/* ANALYTICS */}
                {/* ================================= */}

                <section style={styles.analyticsSection}>

                    <div style={styles.analyticsHeader}>

                        <div>

                            <h2 style={styles.analyticsTitle}>
                                Support Analytics
                            </h2>

                            <p style={styles.analyticsSubtitle}>
                                Understand ticket distribution
                                and agent workload.
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ANALYTICS CARDS */}
                    {/* ================================= */}

                    <div style={styles.analyticsGrid}>


                        {/* PRIORITY */}

                        <div style={styles.analyticsCard}>

                            <h3>
                                Priority Distribution
                            </h3>

                            <p style={styles.cardDescription}>
                                Tickets by priority
                            </p>


                            <AnalyticsBar
                                label="Low"
                                value={
                                    getStatCount(
                                        priorityStats,
                                        "low"
                                    )
                                }
                                max={maxPriority}
                            />

                            <AnalyticsBar
                                label="Medium"
                                value={
                                    getStatCount(
                                        priorityStats,
                                        "medium"
                                    )
                                }
                                max={maxPriority}
                            />

                            <AnalyticsBar
                                label="High"
                                value={
                                    getStatCount(
                                        priorityStats,
                                        "high"
                                    )
                                }
                                max={maxPriority}
                            />

                            <AnalyticsBar
                                label="Urgent"
                                value={
                                    getStatCount(
                                        priorityStats,
                                        "urgent"
                                    )
                                }
                                max={maxPriority}
                            />

                        </div>


                        {/* CATEGORY */}

                        <div style={styles.analyticsCard}>

                            <h3>
                                Category Distribution
                            </h3>

                            <p style={styles.cardDescription}>
                                Tickets by category
                            </p>


                            <AnalyticsBar
                                label="Technical"
                                value={
                                    getStatCount(
                                        categoryStats,
                                        "technical"
                                    )
                                }
                                max={maxCategory}
                            />

                            <AnalyticsBar
                                label="Billing"
                                value={
                                    getStatCount(
                                        categoryStats,
                                        "billing"
                                    )
                                }
                                max={maxCategory}
                            />

                            <AnalyticsBar
                                label="Account"
                                value={
                                    getStatCount(
                                        categoryStats,
                                        "account"
                                    )
                                }
                                max={maxCategory}
                            />

                            <AnalyticsBar
                                label="General"
                                value={
                                    getStatCount(
                                        categoryStats,
                                        "general"
                                    )
                                }
                                max={maxCategory}
                            />

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* AGENT WORKLOAD */}
                    {/* ================================= */}

                    <div style={styles.workloadCard}>

                        <div style={styles.workloadHeader}>

                            <div>

                                <h3>
                                    Agent Workload
                                </h3>

                                <p style={styles.cardDescription}>
                                    Monitor assigned,
                                    active and resolved tickets.
                                </p>

                            </div>

                            <span style={styles.agentCount}>
                                {agentWorkload.length} Agents
                            </span>

                        </div>


                        {agentWorkload.length === 0 ? (

                            <div style={styles.noWorkload}>
                                No assigned tickets yet.
                            </div>

                        ) : (

                            <div style={styles.workloadGrid}>

                                {agentWorkload.map(
                                    (agent) => (

                                        <div
                                            key={
                                                agent.agentId
                                            }
                                            style={
                                                styles.agentCard
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.agentTop
                                                }
                                            >

                                                <div>

                                                    <h4
                                                        style={
                                                            styles.agentName
                                                        }
                                                    >
                                                        {
                                                            agent.name
                                                        }
                                                    </h4>

                                                    <small
                                                        style={
                                                            styles.agentDepartment
                                                        }
                                                    >
                                                        {
                                                            agent.department ||
                                                            "Support"
                                                        }
                                                    </small>

                                                </div>

                                                <span
                                                    style={
                                                        styles.activeBadge
                                                    }
                                                >
                                                    {
                                                        agent.activeTickets
                                                    } active
                                                </span>

                                            </div>


                                            <div
                                                style={
                                                    styles.workloadStats
                                                }
                                            >

                                                <WorkloadStat
                                                    label="Total"
                                                    value={
                                                        agent.totalTickets
                                                    }
                                                />

                                                <WorkloadStat
                                                    label="Active"
                                                    value={
                                                        agent.activeTickets
                                                    }
                                                />

                                                <WorkloadStat
                                                    label="Resolved"
                                                    value={
                                                        agent.resolvedTickets
                                                    }
                                                />

                                            </div>


                                            <div
                                                style={
                                                    styles.workloadProgress
                                                }
                                            >

                                                <div
                                                    style={{
                                                        ...styles.progressFill,
                                                        width:
                                                            `${Math.min(
                                                                100,
                                                                agent.totalTickets
                                                                    ? (
                                                                        agent.activeTickets /
                                                                        agent.totalTickets
                                                                    ) *
                                                                    100
                                                                    : 0
                                                            )}%`
                                                    }}
                                                />

                                            </div>


                                            <small
                                                style={
                                                    styles.progressText
                                                }
                                            >
                                                Active workload
                                            </small>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>


                {/* ================================= */}
                {/* FILTERS */}
                {/* ================================= */}

                <div style={styles.filterCard}>

                    <div style={styles.filterHeader}>

                        <div>

                            <h2 style={{ margin: 0 }}>
                                Ticket Management
                            </h2>

                            <p style={styles.filterSubtext}>
                                Search and filter customer
                                tickets.
                            </p>

                        </div>


                        <button
                            onClick={clearFilters}
                            style={styles.clearButton}
                        >
                            Clear Filters
                        </button>

                    </div>


                    {/* SEARCH */}

                    <input
                        type="text"
                        placeholder="Search by title, description, customer or agent..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        style={styles.searchInput}
                    />


                    {/* FILTER ROW */}

                    <div style={styles.filters}>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            style={styles.select}
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="open">
                                Open
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="resolved">
                                Resolved
                            </option>

                        </select>


                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(
                                    e.target.value
                                )
                            }
                            style={styles.select}
                        >

                            <option value="all">
                                All Priorities
                            </option>

                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="urgent">
                                Urgent
                            </option>

                        </select>


                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value
                                )
                            }
                            style={styles.select}
                        >

                            <option value="all">
                                All Categories
                            </option>

                            <option value="technical">
                                Technical
                            </option>

                            <option value="billing">
                                Billing
                            </option>

                            <option value="account">
                                Account
                            </option>

                            <option value="general">
                                General
                            </option>

                        </select>


                        <select
                            value={agentFilter}
                            onChange={(e) =>
                                setAgentFilter(
                                    e.target.value
                                )
                            }
                            style={styles.select}
                        >

                            <option value="all">
                                All Agents
                            </option>

                            {agents.map(
                                (agent) => (

                                    <option
                                        key={
                                            agent._id
                                        }
                                        value={
                                            agent._id
                                        }
                                    >
                                        {agent.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div style={styles.resultCount}>

                        Showing{" "}

                        <strong>
                            {filteredTickets.length}
                        </strong>{" "}

                        of{" "}

                        <strong>
                            {tickets.length}
                        </strong>{" "}

                        tickets

                    </div>

                </div>


                {/* ================================= */}
                {/* TICKETS */}
                {/* ================================= */}

                <h2 style={styles.sectionTitle}>
                    Customer Tickets
                </h2>


                {filteredTickets.length === 0 ? (

                    <div style={styles.empty}>

                        <h3>
                            No tickets found
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                        <button
                            onClick={clearFilters}
                            style={styles.refreshButton}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div style={styles.grid}>

                        {filteredTickets.map(
                            (ticket) => (

                                <div
                                    key={
                                        ticket._id
                                    }
                                    style={styles.ticket}
                                >

                                    <div
                                        style={
                                            styles.ticketTop
                                        }
                                    >

                                        <h2
                                            style={{
                                                marginTop: 0,
                                                marginBottom: 0
                                            }}
                                        >
                                            {
                                                ticket.title
                                            }
                                        </h2>


                                        <span
                                            style={{
                                                ...styles.status,
                                                background:
                                                    getStatusBackground(
                                                        ticket.status
                                                    )
                                            }}
                                        >
                                            {
                                                ticket.status
                                            }
                                        </span>

                                    </div>


                                    <p
                                        style={
                                            styles.description
                                        }
                                    >
                                        {
                                            ticket.description
                                        }
                                    </p>


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
                                                "General"
                                            }
                                        </span>


                                        <span
                                            style={
                                                styles.priority
                                            }
                                        >
                                            {
                                                ticket.priority ||
                                                "medium"
                                            }
                                        </span>

                                    </div>


                                    <hr />


                                    <div
                                        style={
                                            styles.infoRow
                                        }
                                    >

                                        <div>

                                            <strong>
                                                Customer
                                            </strong>

                                            <p>
                                                {
                                                    ticket
                                                        .createdBy
                                                        ?.name ||
                                                    "Unknown"
                                                }
                                            </p>

                                            <small>
                                                {
                                                    ticket
                                                        .createdBy
                                                        ?.email ||
                                                    "No email"
                                                }
                                            </small>

                                        </div>


                                        <div>

                                            <strong>
                                                AI Department
                                            </strong>

                                            <p>
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        ?.suggestedDepartment ||
                                                    "Not available"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* ASSIGNMENT */}

                                    <div
                                        style={
                                            styles.assignment
                                        }
                                    >

                                        <strong>
                                            Assigned Agent
                                        </strong>


                                        {ticket.assignedTo ? (

                                            <div
                                                style={
                                                    styles.currentAgent
                                                }
                                            >

                                                <span>
                                                    ✓{" "}
                                                    {
                                                        ticket
                                                            .assignedTo
                                                            .name ||
                                                        "Assigned"
                                                    }
                                                </span>

                                                <small>
                                                    {
                                                        ticket
                                                            .assignedTo
                                                            .department ||
                                                        "Support Agent"
                                                    }
                                                </small>

                                            </div>

                                        ) : (

                                            <p
                                                style={
                                                    styles.notAssigned
                                                }
                                            >
                                                Not assigned yet
                                            </p>

                                        )}


                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
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
                                                assigning ===
                                                ticket._id
                                            }
                                            style={
                                                styles.select
                                            }
                                        >

                                            <option value="">
                                                Select an agent
                                            </option>


                                            {agents.map(
                                                (agent) => (

                                                    <option
                                                        key={
                                                            agent._id
                                                        }
                                                        value={
                                                            agent._id
                                                        }
                                                    >
                                                        {
                                                            agent.name
                                                        }

                                                        {
                                                            agent.department
                                                                ? ` - ${agent.department}`
                                                                : ""
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {assigning ===
                                            ticket._id && (

                                            <small
                                                style={
                                                    styles.assigningText
                                                }
                                            >
                                                Assigning ticket...
                                            </small>

                                        )}

                                    </div>


                                    {/* AI ANALYSIS */}

                                    {ticket.aiAnalysis && (

                                        <div
                                            style={
                                                styles.aiBox
                                            }
                                        >

                                            <h3>
                                                🤖 AI Analysis
                                            </h3>


                                            <p>
                                                <strong>
                                                    Category:
                                                </strong>{" "}
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .category ||
                                                    "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Priority:
                                                </strong>{" "}
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .priority ||
                                                    "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Intent:
                                                </strong>{" "}
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .intent ||
                                                    "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Summary:
                                                </strong>{" "}
                                                {
                                                    ticket
                                                        .aiAnalysis
                                                        .summary ||
                                                    "N/A"
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>

    );

}


// ========================================
// STAT CARD
// ========================================

function StatCard({
    title,
    value
}) {

    return (

        <div style={styles.statCard}>

            <span style={styles.statTitle}>
                {title}
            </span>

            <strong style={styles.statNumber}>
                {value}
            </strong>

        </div>

    );

}


// ========================================
// ANALYTICS BAR
// ========================================

function AnalyticsBar({
    label,
    value,
    max
}) {

    const width =
        max > 0
            ? `${(value / max) * 100}%`
            : "0%";


    return (

        <div style={styles.barContainer}>

            <div style={styles.barHeader}>

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

            </div>


            <div style={styles.barBackground}>

                <div
                    style={{
                        ...styles.barFill,
                        width
                    }}
                />

            </div>

        </div>

    );

}


// ========================================
// WORKLOAD STAT
// ========================================

function WorkloadStat({
    label,
    value
}) {

    return (

        <div style={styles.workloadStat}>

            <strong>
                {value}
            </strong>

            <span>
                {label}
            </span>

        </div>

    );

}


// ========================================
// STATUS BACKGROUND
// ========================================

function getStatusBackground(status) {

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


// ========================================
// STYLES
// ========================================

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


    logo: {
        margin: 0,
        fontSize: "24px"
    },


    subtitle: {
        color: "#6b7280"
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
        marginBottom: "25px"
    },


    heading: {
        margin: 0,
        fontSize: "32px"
    },


    headerText: {
        color: "#6b7280",
        marginTop: "8px"
    },


    // ========================================
    // STATS
    // ========================================

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
    },


    statCard: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)"
    },


    statTitle: {
        color: "#6b7280",
        fontSize: "14px"
    },


    statNumber: {
        fontSize: "28px"
    },


    message: {
        padding: "14px",
        marginBottom: "20px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
        textAlign: "center"
    },


    // ========================================
    // ANALYTICS
    // ========================================

    analyticsSection: {
        marginBottom: "35px"
    },


    analyticsHeader: {
        marginBottom: "18px"
    },


    analyticsTitle: {
        margin: 0,
        fontSize: "24px"
    },


    analyticsSubtitle: {
        margin: "6px 0 0",
        color: "#6b7280"
    },


    analyticsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
        marginBottom: "20px"
    },


    analyticsCard: {
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)"
    },


    cardDescription: {
        color: "#6b7280",
        marginTop: "5px",
        fontSize: "14px"
    },


    barContainer: {
        marginTop: "22px"
    },


    barHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "7px",
        fontSize: "14px"
    },


    barBackground: {
        height: "9px",
        background: "#e5e7eb",
        borderRadius: "20px",
        overflow: "hidden"
    },


    barFill: {
        height: "100%",
        background: "#4f46e5",
        borderRadius: "20px",
        transition: "width 0.4s ease"
    },


    // ========================================
    // AGENT WORKLOAD
    // ========================================

    workloadCard: {
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)"
    },


    workloadHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        marginBottom: "20px"
    },


    agentCount: {
        padding: "7px 12px",
        background: "#ede9fe",
        color: "#6d28d9",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },


    workloadGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "15px"
    },


    agentCard: {
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px"
    },


    agentTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px"
    },


    agentName: {
        margin: 0,
        fontSize: "17px"
    },


    agentDepartment: {
        color: "#6b7280",
        display: "block",
        marginTop: "4px"
    },


    activeBadge: {
        padding: "5px 9px",
        background: "#fef3c7",
        color: "#92400e",
        borderRadius: "15px",
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },


    workloadStats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "8px",
        marginTop: "20px"
    },


    workloadStat: {
        background: "#f9fafb",
        padding: "12px 6px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px"
    },


    workloadProgress: {
        height: "7px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "18px"
    },


    progressFill: {
        height: "100%",
        background: "#4f46e5",
        borderRadius: "10px",
        transition: "width 0.4s ease"
    },


    progressText: {
        display: "block",
        color: "#9ca3af",
        marginTop: "6px"
    },


    noWorkload: {
        padding: "25px",
        textAlign: "center",
        color: "#6b7280",
        background: "#f9fafb",
        borderRadius: "10px"
    },


    // ========================================
    // FILTERS
    // ========================================

    filterCard: {
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)"
    },


    filterHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px"
    },


    filterSubtext: {
        color: "#6b7280",
        margin: "6px 0 0"
    },


    searchInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border:
            "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        marginBottom: "15px"
    },


    filters: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px"
    },


    select: {
        width: "100%",
        padding: "11px",
        border:
            "1px solid #d1d5db",
        borderRadius: "8px",
        background: "white",
        cursor: "pointer",
        boxSizing: "border-box"
    },


    clearButton: {
        padding: "10px 15px",
        border:
            "1px solid #d1d5db",
        borderRadius: "8px",
        background: "white",
        cursor: "pointer",
        fontWeight: "600"
    },


    resultCount: {
        marginTop: "18px",
        color: "#6b7280",
        fontSize: "14px"
    },


    // ========================================
    // TICKETS
    // ========================================

    sectionTitle: {
        marginBottom: "20px"
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
        color: "#6b7280"
    },


    label: {
        display: "block",
        marginTop: "15px",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600"
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
import { useEffect, useMemo, useState } from "react";
import api from "./services/api";
import GalaxyBackground from "./components/GalaxyBackground";
import AnimatedNumber from "./components/AnimatedNumber";

function AdminDashboard({ user, onLogout }) {

    // ======================================================
    // STATE
    // ======================================================

    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [issues, setIssues] = useState([]);
    const [emergingIssues, setEmergingIssues] = useState([]);

    const [loading, setLoading] = useState(true);
    const [issuesLoading, setIssuesLoading] = useState(true);
    const [emergingLoading, setEmergingLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [message, setMessage] = useState("");
    const [assigning, setAssigning] = useState(null);

    // ======================================================
    // ISSUE MODAL
    // ======================================================

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueTickets, setIssueTickets] = useState([]);
    const [issueTicketsLoading, setIssueTicketsLoading] = useState(false);
    const [issueError, setIssueError] = useState("");

    // ======================================================
    // FILTERS
    // ======================================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [agentFilter, setAgentFilter] = useState("all");

    // ======================================================
    // FETCH TICKETS
    // ======================================================

    const fetchTickets = async () => {

        try {

            const response =
                await api.get("/tickets/all");

            setTickets(
                response.data?.tickets || []
            );

        } catch (error) {

            console.error(
                "TICKETS ERROR:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load tickets"
            );

        }

    };

    // ======================================================
    // FETCH AGENTS
    // ======================================================

    const fetchAgents = async () => {

        try {

            const response =
                await api.get("/agent/agents");

            setAgents(
                response.data?.agents || []
            );

        } catch (error) {

            console.error(
                "AGENTS ERROR:",
                error.response?.data || error.message
            );

            setAgents([]);

        }

    };

    // ======================================================
    // FETCH ANALYTICS
    // ======================================================

    const fetchAnalytics = async () => {

        try {

            const response =
                await api.get("/tickets/analytics");

            setAnalytics(
                response.data || null
            );

        } catch (error) {

            console.error(
                "ANALYTICS ERROR:",
                error.response?.data || error.message
            );

            setAnalytics(null);

        }

    };

    // ======================================================
    // FETCH RECURRING ISSUES
    // ======================================================

    const fetchIssues = async () => {

        try {

            setIssuesLoading(true);

            const response =
                await api.get("/issues");

            setIssues(
                response.data?.issues || []
            );

        } catch (error) {

            console.error(
                "ISSUES ERROR:",
                error.response?.data || error.message
            );

            setIssues([]);

        } finally {

            setIssuesLoading(false);

        }

    };

    // ======================================================
    // FETCH EMERGING ISSUES
    // ======================================================

    const fetchEmergingIssues = async () => {

        try {

            setEmergingLoading(true);

            const response =
                await api.get("/issues/emerging");

            setEmergingIssues(
                response.data?.issues || []
            );

        } catch (error) {

            console.error(
                "EMERGING ISSUES ERROR:",
                error.response?.data || error.message
            );

            setEmergingIssues([]);

        } finally {

            setEmergingLoading(false);

        }

    };

    // ======================================================
    // FETCH ISSUE TICKETS
    // ======================================================

    const fetchIssueTickets = async (issue) => {

        const issueId =
            issue?._id ||
            issue?.issueId;

        if (!issueId) {

            setIssueError(
                "Issue ID is missing"
            );

            return;

        }

        try {

            setSelectedIssue(issue);
            setIssueTickets([]);
            setIssueError("");
            setIssueTicketsLoading(true);

            const response =
                await api.get(
                    `/issues/${issueId}/tickets`
                );

            setIssueTickets(
                response.data?.tickets || []
            );

        } catch (error) {

            console.error(
                "ISSUE TICKETS ERROR:",
                error.response?.data || error.message
            );

            setIssueError(
                error.response?.data?.message ||
                "Failed to load related tickets"
            );

        } finally {

            setIssueTicketsLoading(false);

        }

    };

    // ======================================================
    // CLOSE ISSUE MODAL
    // ======================================================

    const closeIssueModal = () => {

        setSelectedIssue(null);
        setIssueTickets([]);
        setIssueError("");

    };

    // ======================================================
    // LOAD DASHBOARD
    // ======================================================

    const loadDashboard = async (
        showLoader = true
    ) => {

        if (showLoader) {
            setLoading(true);
        }

        await Promise.all([
            fetchTickets(),
            fetchAgents(),
            fetchAnalytics(),
            fetchIssues(),
            fetchEmergingIssues()
        ]);

        if (showLoader) {
            setLoading(false);
        }

    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        loadDashboard(true);

    }, []);

    // ======================================================
    // REFRESH
    // ======================================================

    const refreshDashboard = async () => {

        try {

            setRefreshing(true);
            setMessage("");

            await loadDashboard(false);

            setMessage(
                "Dashboard refreshed successfully ✓"
            );

        } catch (error) {

            console.error(
                "REFRESH ERROR:",
                error
            );

            setMessage(
                "Failed to refresh dashboard"
            );

        } finally {

            setRefreshing(false);

        }

    };

    // ======================================================
    // TICKET STATS
    // ======================================================

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

    // ======================================================
    // FILTERED TICKETS
    // ======================================================

    const filteredTickets = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        return tickets.filter(
            ticket => {

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
                    ticket.assignedTo?._id === agentFilter ||
                    ticket.assignedTo === agentFilter;

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

    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setCategoryFilter("all");
        setAgentFilter("all");

    };

    // ======================================================
    // ASSIGN TICKET
    // ======================================================

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

            await api.patch(
                `/tickets/${ticketId}/assign`,
                {
                    agentId
                }
            );

            setMessage(
                "Ticket assigned successfully 🎉"
            );

            await Promise.all([
                fetchTickets(),
                fetchAnalytics()
            ]);

        } catch (error) {

            console.error(
                "ASSIGNMENT ERROR:",
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

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <div style={styles.bigEmoji}>
                        🧠
                    </div>

                    <h2>
                        Loading Nesti Admin...
                    </h2>

                    <p>
                        Fetching tickets, agents and AI intelligence
                    </p>

                </div>

            </div>

        );

    }

    // ======================================================
    // ANALYTICS
    // ======================================================

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

    // ======================================================
    // DASHBOARD
    // ======================================================

    return (

        <div style={styles.page}>

            <GalaxyBackground />

            {/* ================================================= */}
            {/* NAVBAR */}
            {/* ================================================= */}

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

                    <button
                        onClick={refreshDashboard}
                        disabled={refreshing}
                        style={{
                            ...styles.refreshButton,
                            opacity:
                                refreshing
                                    ? 0.6
                                    : 1
                        }}
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>

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

            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main style={styles.container}>

                <div style={styles.header}>

                    <h1 style={styles.heading}>
                        Admin Dashboard
                    </h1>

                    <p style={styles.headerText}>
                        Monitor tickets, agents and recurring customer problems.
                    </p>

                </div>

                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <div style={styles.statsGrid} className="nesti-stagger">

                    <StatCard
                        title="Total Tickets"
                        value={stats.total}
                        icon="🎫"
                    />

                    <StatCard
                        title="Open"
                        value={stats.open}
                        icon="📂"
                    />

                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon="⚙️"
                    />

                    <StatCard
                        title="Resolved"
                        value={stats.resolved}
                        icon="✅"
                    />

                    <StatCard
                        title="Urgent"
                        value={stats.urgent}
                        icon="🚨"
                    />

                </div>

                {/* ================================================= */}
                {/* MESSAGE */}
                {/* ================================================= */}

                {message && (

                    <div style={styles.message}>
                        {message}
                    </div>

                )}

                {/* ================================================= */}
                {/* EMERGING ISSUES */}
                {/* ================================================= */}

                <section style={styles.emergingSection}>

                    <div style={styles.emergingHeader}>

                        <div>

                            <h2 style={styles.emergingTitle}>
                                🚨 Emerging Issues
                            </h2>

                            <p style={styles.emergingSubtitle}>
                                Nesti detects sudden spikes in customer problems.
                            </p>

                        </div>

                        <div style={styles.emergingBadge}>
                            {emergingIssues.length}
                        </div>

                    </div>

                    {emergingLoading ? (

                        <div style={styles.emergingLoading}>

                            <div style={styles.loadingIcon}>
                                🔍
                            </div>

                            <h3>
                                Checking for emerging issues...
                            </h3>

                            <p>
                                Nesti is analyzing recent ticket activity.
                            </p>

                        </div>

                    ) : emergingIssues.length === 0 ? (

                        <div style={styles.noEmergingIssues}>

                            <div style={styles.noEmergingIcon}>
                                ✅
                            </div>

                            <div>

                                <h3 style={styles.noEmergingTitle}>
                                    No emerging issues
                                </h3>

                                <p style={styles.noEmergingText}>
                                    No unusual ticket spike has been detected recently.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div style={styles.emergingGrid}>

                            {emergingIssues.map(
                                issue => (

                                    <div
                                        key={
                                            issue.issueId ||
                                            issue._id ||
                                            issue.issueKey
                                        }
                                        style={styles.emergingCard} className="nesti-card-hover"
                                    >

                                        <div style={styles.emergingCardTop}>

                                            <div>

                                                <span style={styles.alertLabel}>
                                                    🚨 SPIKE DETECTED
                                                </span>

                                                <h3 style={styles.emergingCardTitle}>
                                                    {
                                                        issue.title ||
                                                        "Emerging Issue"
                                                    }
                                                </h3>

                                                <span style={styles.issueKey}>
                                                    {
                                                        issue.issueKey ||
                                                        "unknown_issue"
                                                    }
                                                </span>

                                            </div>

                                            <span
                                                style={
                                                    getSeverityStyle(
                                                        issue.severity
                                                    )
                                                }
                                            >
                                                {
                                                    issue.severity ||
                                                    "high"
                                                }
                                            </span>

                                        </div>

                                        <div style={styles.emergingStats}>

                                            <EmergingStat
                                                value={
                                                    issue.currentCount ?? 0
                                                }
                                                label="Current"
                                            />

                                            <EmergingStat
                                                value={
                                                    issue.previousCount ?? 0
                                                }
                                                label="Previous"
                                            />

                                            <EmergingStat
                                                value={
                                                    `${issue.percentageIncrease ?? 0}%`
                                                }
                                                label="Increase"
                                            />

                                        </div>

                                        <div style={styles.emergingDetails}>

                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {
                                                    issue.category ||
                                                    "General"
                                                }
                                            </strong>

                                        </div>

                                        <div style={styles.emergingDetails}>

                                            <span>
                                                Department
                                            </span>

                                            <strong>
                                                {
                                                    issue.department ||
                                                    "General Support"
                                                }
                                            </strong>

                                        </div>

                                        <div style={styles.emergingWarning}>
                                            ⚠️ Customer reports for this issue have increased significantly.
                                        </div>

                                        <button
                                            onClick={() =>
                                                fetchIssueTickets(issue)
                                            }
                                            style={styles.emergingViewButton}
                                        >
                                            View Related Tickets →
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* ================================================= */}
                {/* AI ISSUE INTELLIGENCE */}
                {/* ================================================= */}

                <section style={styles.issueSection}>

                    <div style={styles.issueHeader}>

                        <div>

                            <h2 style={styles.issueTitle}>
                                🧠 AI Issue Intelligence
                            </h2>

                            <p style={styles.issueSubtitle}>
                                Nesti automatically identifies recurring customer
                                problems across support tickets.
                            </p>

                        </div>

                        <span style={styles.issueBadge}>
                            {issues.length}{" "}
                            {
                                issues.length === 1
                                    ? "issue detected"
                                    : "issues detected"
                            }
                        </span>

                    </div>

                    {issuesLoading ? (

                        <div style={styles.issueLoading}>

                            <div style={styles.loadingIcon}>
                                🧠
                            </div>

                            <h3>
                                Analyzing recurring issues...
                            </h3>

                            <p>
                                Nesti is processing ticket intelligence.
                            </p>

                        </div>

                    ) : issues.length === 0 ? (

                        <div style={styles.noIssues}>

                            <div style={styles.noIssuesIcon}>
                                ✨
                            </div>

                            <h3>
                                No recurring issues detected yet
                            </h3>

                            <p>
                                As more customer tickets arrive, Nesti will
                                automatically identify similar problems.
                            </p>

                        </div>

                    ) : (

                        <div style={styles.issueGrid}>

                            {issues.map(
                                issue => (

                                    <div
                                        key={issue._id}
                                        style={styles.issueCard} className="nesti-card-hover"
                                    >

                                        <div style={styles.issueCardTop}>

                                            <div style={styles.issueIcon}>
                                                🧠
                                            </div>

                                            <div style={styles.issueTitleContainer}>

                                                <h3 style={styles.issueCardTitle}>
                                                    {
                                                        issue.title ||
                                                        "Recurring Issue"
                                                    }
                                                </h3>

                                                <span style={styles.issueKey}>
                                                    {
                                                        issue.issueKey ||
                                                        "unknown_issue"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        <p style={styles.issueDescription}>
                                            {
                                                issue.description ||
                                                "Nesti detected multiple tickets related to this issue."
                                            }
                                        </p>

                                        <div style={styles.issueCountBox}>

                                            <strong style={styles.issueCount}>
                                                {
                                                    issue.ticketCount || 0
                                                }
                                            </strong>

                                            <span style={styles.issueCountText}>
                                                related tickets
                                            </span>

                                        </div>

                                        <div style={styles.issueDetails}>

                                            <div style={styles.issueDetailItem}>

                                                <small>
                                                    Category
                                                </small>

                                                <strong>
                                                    {
                                                        issue.category ||
                                                        "General"
                                                    }
                                                </strong>

                                            </div>

                                            <div style={styles.issueDetailItem}>

                                                <small>
                                                    Department
                                                </small>

                                                <strong>
                                                    {
                                                        issue.department ||
                                                        "General Support"
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                        <div style={styles.issueDates}>

                                            <span>
                                                First detected
                                            </span>

                                            <strong>
                                                {
                                                    formatIssueDate(
                                                        issue.firstDetectedAt
                                                    )
                                                }
                                            </strong>

                                        </div>

                                        <div style={styles.issueDates}>

                                            <span>
                                                Last detected
                                            </span>

                                            <strong>
                                                {
                                                    formatIssueDate(
                                                        issue.lastDetectedAt
                                                    )
                                                }
                                            </strong>

                                        </div>

                                        <button
                                            onClick={() =>
                                                fetchIssueTickets(issue)
                                            }
                                            style={styles.viewIssueButton}
                                        >
                                            <span>
                                                View Related Tickets
                                            </span>

                                            <span>
                                                →
                                            </span>

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* ================================================= */}
                {/* ANALYTICS */}
                {/* ================================================= */}

                <section style={styles.analyticsSection}>

                    <div style={styles.analyticsHeader}>

                        <h2 style={styles.analyticsTitle}>
                            Support Analytics
                        </h2>

                        <p style={styles.analyticsSubtitle}>
                            Understand ticket distribution and agent workload.
                        </p>

                    </div>

                    <div style={styles.analyticsGrid}>

                        <div style={styles.analyticsCard} className="nesti-card-hover">

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

                        <div style={styles.analyticsCard} className="nesti-card-hover">

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

                    {/* ================================================= */}
                    {/* AGENT WORKLOAD */}
                    {/* ================================================= */}

                    <div style={styles.workloadCard} className="nesti-card-hover">

                        <div style={styles.workloadHeader}>

                            <div>

                                <h3>
                                    Agent Workload
                                </h3>

                                <p style={styles.cardDescription}>
                                    Monitor assigned, active and resolved tickets.
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
                                    agent => (

                                        <div
                                            key={agent.agentId}
                                            style={styles.agentCard} className="nesti-card-hover"
                                        >

                                            <div style={styles.agentCardHeader}>

                                                <div>

                                                    <h4 style={styles.agentName}>
                                                        {agent.name}
                                                    </h4>

                                                    <p style={styles.agentEmail}>
                                                        {agent.email}
                                                    </p>

                                                </div>

                                                <span style={styles.agentDepartment}>
                                                    {
                                                        agent.department ||
                                                        "Support"
                                                    }
                                                </span>

                                            </div>

                                            <div style={styles.workloadStats}>

                                                <WorkloadStat
                                                    label="Total"
                                                    value={
                                                        agent.totalTickets || 0
                                                    }
                                                />

                                                <WorkloadStat
                                                    label="Active"
                                                    value={
                                                        agent.activeTickets || 0
                                                    }
                                                />

                                                <WorkloadStat
                                                    label="Resolved"
                                                    value={
                                                        agent.resolvedTickets || 0
                                                    }
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>

                {/* ================================================= */}
                {/* ALL TICKETS */}
                {/* ================================================= */}

                <section style={styles.ticketSection}>

                    <div style={styles.ticketSectionHeader}>

                        <div>

                            <h2 style={styles.sectionTitle}>
                                All Customer Tickets
                            </h2>

                            <p style={styles.sectionSubtitle}>
                                Manage tickets and assign them to support agents.
                            </p>

                        </div>

                        <div style={styles.ticketCountBadge}>
                            {filteredTickets.length} shown
                        </div>

                    </div>

                    {/* FILTERS */}

                    <div style={styles.filtersCard}>

                        <input
                            type="text"
                            placeholder="Search tickets, customers..."
                            value={search}
                            onChange={e =>
                                setSearch(e.target.value)
                            }
                            style={styles.searchInput}
                        />

                        <select
                            value={statusFilter}
                            onChange={e =>
                                setStatusFilter(e.target.value)
                            }
                            style={styles.filterSelect}
                        >

                            <option value="all">
                                All Status
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

                            <option value="closed">
                                Closed
                            </option>

                        </select>

                        <select
                            value={priorityFilter}
                            onChange={e =>
                                setPriorityFilter(e.target.value)
                            }
                            style={styles.filterSelect}
                        >

                            <option value="all">
                                All Priority
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
                            onChange={e =>
                                setCategoryFilter(e.target.value)
                            }
                            style={styles.filterSelect}
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
                            onChange={e =>
                                setAgentFilter(e.target.value)
                            }
                            style={styles.filterSelect}
                        >

                            <option value="all">
                                All Agents
                            </option>

                            {agents.map(
                                agent => (

                                    <option
                                        key={agent._id}
                                        value={agent._id}
                                    >
                                        {agent.name}
                                    </option>

                                )
                            )}

                        </select>

                        <button
                            onClick={clearFilters}
                            style={styles.clearButton}
                        >
                            Clear
                        </button>

                    </div>

                    {/* TICKET LIST */}

                    {filteredTickets.length === 0 ? (

                        <div style={styles.empty}>

                            <div style={styles.emptyIcon}>
                                🎫
                            </div>

                            <h3>
                                No tickets found
                            </h3>

                            <p>
                                Try changing your filters or create a new ticket.
                            </p>

                        </div>

                    ) : (

                        <div style={styles.ticketGrid}>

                            {filteredTickets.map(
                                ticket => (

                                    <div
                                        key={ticket._id}
                                        style={styles.ticket}
                                    >

                                        <div style={styles.ticketTop}>

                                            <h3 style={styles.ticketTitle}>
                                                {ticket.title}
                                            </h3>

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
                                                    formatStatus(
                                                        ticket.status
                                                    )
                                                }
                                            </span>

                                        </div>

                                        <p style={styles.description}>
                                            {ticket.description}
                                        </p>

                                        <div style={styles.tags}>

                                            <span style={styles.category}>
                                                {ticket.category}
                                            </span>

                                            <span style={styles.priority}>
                                                {ticket.priority}
                                            </span>

                                        </div>

                                        <hr style={styles.line} />

                                        <div style={styles.infoGrid}>

                                            <div>

                                                <small>
                                                    Customer
                                                </small>

                                                <p style={styles.infoText}>
                                                    {
                                                        ticket.createdBy?.name ||
                                                        "Unknown"
                                                    }
                                                </p>

                                                <small style={styles.email}>
                                                    {
                                                        ticket.createdBy?.email ||
                                                        "N/A"
                                                    }
                                                </small>

                                            </div>

                                            <div>

                                                <small>
                                                    Assigned Agent
                                                </small>

                                                {ticket.assignedTo ? (

                                                    <p style={styles.infoText}>
                                                        {
                                                            ticket.assignedTo.name
                                                        }
                                                    </p>

                                                ) : (

                                                    <p style={styles.notAssigned}>
                                                        Not assigned
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                        {/* ASSIGNMENT */}

                                        <div style={styles.assignment}>

                                            <strong>
                                                Agent Assignment
                                            </strong>

                                            {ticket.assignedTo && (

                                                <div style={styles.currentAgent}>

                                                    <strong>
                                                        {
                                                            ticket.assignedTo.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            ticket.assignedTo.department ||
                                                            "Support Agent"
                                                        }
                                                    </small>

                                                </div>

                                            )}

                                            <label style={styles.label}>
                                                Assign / Change Agent
                                            </label>

                                            <select
                                                value={
                                                    ticket.assignedTo?._id ||
                                                    ticket.assignedTo ||
                                                    ""
                                                }
                                                onChange={e =>
                                                    assignTicket(
                                                        ticket._id,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    assigning ===
                                                    ticket._id
                                                }
                                                style={styles.select}
                                            >

                                                <option value="">
                                                    Select an agent
                                                </option>

                                                {agents.map(
                                                    agent => (

                                                        <option
                                                            key={agent._id}
                                                            value={agent._id}
                                                        >
                                                            {agent.name}
                                                            {
                                                                agent.department
                                                                    ? ` - ${agent.department}`
                                                                    : ""
                                                            }
                                                        </option>

                                                    )
                                                )}

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

                                        {/* ================================================= */}
                                        {/* AI ANALYSIS */}
                                        {/* ================================================= */}

                                        {ticket.aiAnalysis && (

                                            <div style={styles.aiBox}>

                                                <h3>
                                                    🤖 AI Analysis
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Category:
                                                    </strong>{" "}
                                                    {
                                                        ticket.aiAnalysis.category ||
                                                        "N/A"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Priority:
                                                    </strong>{" "}
                                                    {
                                                        ticket.aiAnalysis.priority ||
                                                        "N/A"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Intent:
                                                    </strong>{" "}
                                                    {
                                                        ticket.aiAnalysis.intent ||
                                                        "N/A"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Summary:
                                                    </strong>{" "}
                                                    {
                                                        ticket.aiAnalysis.summary ||
                                                        "N/A"
                                                    }
                                                </p>

                                                {/* ================================================= */}
                                                {/* AI RECOMMENDED SOLUTION ⭐ */}
                                                {/* ================================================= */}

                                                {ticket.aiAnalysis.recommendedSolution && (

                                                    <div style={styles.solutionBox}>

                                                        <div style={styles.solutionHeader}>

                                                            <div>

                                                                <span style={styles.solutionLabel}>
                                                                    ✨ AI RECOMMENDED SOLUTION
                                                                </span>

                                                                <h4 style={styles.solutionAction}>
                                                                    {
                                                                        ticket.aiAnalysis.recommendedAction ||
                                                                        "Review and investigate the reported issue"
                                                                    }
                                                                </h4>

                                                            </div>

                                                            <span
                                                                style={{
                                                                    ...styles.confidenceBadge,
                                                                    background:
                                                                        ticket.aiAnalysis.solutionConfidence === "high"
                                                                            ? "rgba(52,211,153,0.12)"
                                                                            : ticket.aiAnalysis.solutionConfidence === "medium"
                                                                                ? "rgba(251,191,36,0.12)"
                                                                                : "rgba(251,113,133,0.12)",
                                                                    color:
                                                                        ticket.aiAnalysis.solutionConfidence === "high"
                                                                            ? "#34D399"
                                                                            : ticket.aiAnalysis.solutionConfidence === "medium"
                                                                                ? "#FBBF24"
                                                                                : "#FB7185"
                                                                }}
                                                            >
                                                                {
                                                                    ticket.aiAnalysis.solutionConfidence ||
                                                                    "medium"
                                                                }{" "}
                                                                confidence
                                                            </span>

                                                        </div>

                                                        <p style={styles.solutionText}>
                                                            {
                                                                ticket.aiAnalysis.recommendedSolution
                                                            }
                                                        </p>

                                                    </div>

                                                )}

                                                {/* ================================================= */}
                                                {/* DETECTED ISSUE */}
                                                {/* ================================================= */}

                                                {ticket.detectedIssue && (

                                                    <div
                                                        style={
                                                            styles.detectedIssueBox
                                                        }
                                                    >

                                                        <strong>
                                                            🧠 AI Detected Issue
                                                        </strong>

                                                        <span>
                                                            {
                                                                ticket.detectedIssue.title ||
                                                                "Recurring Issue"
                                                            }
                                                        </span>

                                                        {ticket.detectedIssue.issueKey && (

                                                            <small>
                                                                {
                                                                    ticket.detectedIssue.issueKey
                                                                }
                                                            </small>

                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

            {/* ================================================= */}
            {/* ISSUE MODAL */}
            {/* ================================================= */}

            {selectedIssue && (

                <div
                    style={styles.modalOverlay}
                    onClick={closeIssueModal}
                >

                    <div
                        style={styles.modal}
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >

                        <div style={styles.modalHeader}>

                            <div>

                                <span style={styles.modalEyebrow}>
                                    🧠 AI DETECTED ISSUE
                                </span>

                                <h2 style={styles.modalTitle}>
                                    {
                                        selectedIssue.title ||
                                        "Recurring Issue"
                                    }
                                </h2>

                                <span style={styles.modalIssueKey}>
                                    {
                                        selectedIssue.issueKey ||
                                        "unknown_issue"
                                    }
                                </span>

                            </div>

                            <button
                                onClick={closeIssueModal}
                                style={styles.closeButton}
                            >
                                ×
                            </button>

                        </div>

                        <div style={styles.modalSummary}>

                            <div style={styles.modalSummaryItem}>

                                <small>
                                    Related Tickets
                                </small>

                                <strong>
                                    {
                                        selectedIssue.ticketCount ||
                                        issueTickets.length
                                    }
                                </strong>

                            </div>

                            <div style={styles.modalSummaryItem}>

                                <small>
                                    Category
                                </small>

                                <strong>
                                    {
                                        selectedIssue.category ||
                                        "General"
                                    }
                                </strong>

                            </div>

                            <div style={styles.modalSummaryItem}>

                                <small>
                                    Department
                                </small>

                                <strong>
                                    {
                                        selectedIssue.department ||
                                        "General Support"
                                    }
                                </strong>

                            </div>

                        </div>

                        {selectedIssue.percentageIncrease !== undefined && (

                            <div style={styles.modalSpikeBox}>

                                <span>
                                    🚨 Recent Spike
                                </span>

                                <strong>
                                    +
                                    {
                                        selectedIssue.percentageIncrease
                                    }%
                                </strong>

                                <small>
                                    {
                                        selectedIssue.currentCount || 0
                                    }{" "}
                                    current tickets vs{" "}
                                    {
                                        selectedIssue.previousCount || 0
                                    }{" "}
                                    previous tickets
                                </small>

                            </div>

                        )}

                        <p style={styles.modalDescription}>
                            {
                                selectedIssue.description ||
                                "Nesti identified multiple tickets describing the same underlying customer problem."
                            }
                        </p>

                        <div style={styles.modalTicketsHeader}>

                            <h3 style={styles.modalTicketsHeaderH3}>
                                Related Tickets
                            </h3>

                            <span>
                                {issueTickets.length} tickets
                            </span>

                        </div>

                        {issueTicketsLoading ? (

                            <div style={styles.modalLoading}>
                                🔍 Loading related tickets...
                            </div>

                        ) : issueError ? (

                            <div style={styles.modalError}>
                                {issueError}
                            </div>

                        ) : issueTickets.length === 0 ? (

                            <div style={styles.modalEmpty}>
                                No related tickets found.
                            </div>

                        ) : (

                            <div style={styles.issueTicketList}>

                                {issueTickets.map(
                                    (ticket, index) => (

                                        <div
                                            key={ticket._id}
                                            style={styles.issueTicket}
                                        >

                                            <div
                                                style={
                                                    styles.issueTicketNumber
                                                }
                                            >
                                                {index + 1}
                                            </div>

                                            <div
                                                style={
                                                    styles.issueTicketContent
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.issueTicketTop
                                                    }
                                                >

                                                    <h4
                                                        style={
                                                            styles.issueTicketTopH4
                                                        }
                                                    >
                                                        {ticket.title}
                                                    </h4>

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
                                                            formatStatus(
                                                                ticket.status
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                                <p
                                                    style={
                                                        styles.issueTicketDescription
                                                    }
                                                >
                                                    {ticket.description}
                                                </p>

                                                <div
                                                    style={
                                                        styles.issueTicketMeta
                                                    }
                                                >

                                                    <span>
                                                        Customer:{" "}
                                                        {
                                                            ticket.createdBy?.name ||
                                                            "Unknown"
                                                        }
                                                    </span>

                                                    <span>
                                                        Agent:{" "}
                                                        {
                                                            ticket.assignedTo?.name ||
                                                            "Not assigned"
                                                        }
                                                    </span>

                                                    <span>
                                                        Priority:{" "}
                                                        {
                                                            ticket.priority ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </div>

                                                {ticket.aiAnalysis?.recommendedAction && (

                                                    <div style={styles.modalSolution}>

                                                        <strong>
                                                            ✨ AI Action:
                                                        </strong>

                                                        <span>
                                                            {
                                                                ticket.aiAnalysis.recommendedAction
                                                            }
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}


// ======================================================
// COMPONENTS
// ======================================================

function StatCard({
    title,
    value,
    icon
}) {

    return (

        <div style={styles.statCard} className="nesti-card-hover">

            <span style={styles.statIcon}>
                {icon}
            </span>

            <span style={styles.statTitle}>
                {title}
            </span>

            <strong style={styles.statNumber}>
                <AnimatedNumber value={value} />
            </strong>

        </div>

    );

}


function EmergingStat({
    value,
    label
}) {

    return (

        <div style={styles.emergingStat}>

            <strong>
                {value}
            </strong>

            <span>
                {label}
            </span>

        </div>

    );

}


function AnalyticsBar({
    label,
    value,
    max
}) {

    const width =
        max > 0
            ? `${Math.min(
                (value / max) * 100,
                100
            )}%`
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


// ======================================================
// HELPERS
// ======================================================

function formatStatus(status) {

    if (!status) {
        return "Unknown";
    }

    if (status === "in-progress") {
        return "In Progress";
    }

    return (
        status.charAt(0).toUpperCase() +
        status.slice(1)
    );

}


function formatIssueDate(date) {

    if (!date) {
        return "N/A";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function getStatusBackground(status) {

    if (status === "open") {
        return "rgba(251,113,133,0.12)";
    }

    if (status === "in-progress") {
        return "rgba(251,191,36,0.12)";
    }

    if (status === "resolved") {
        return "rgba(52,211,153,0.12)";
    }

    if (status === "closed") {
        return "rgba(96,165,250,0.12)";
    }

    return "#202938";

}


function getSeverityStyle(severity) {

    const value =
        String(
            severity || "high"
        ).toLowerCase();

    if (value === "critical") {

        return {
            ...styles.severity,
            background: "#FDA4AF",
            color: "#F8FAFC"
        };

    }

    if (value === "high") {

        return {
            ...styles.severity,
            background: "rgba(251,113,133,0.12)",
            color: "#FB7185"
        };

    }

    if (value === "medium") {

        return {
            ...styles.severity,
            background: "rgba(251,191,36,0.12)",
            color: "#FBBF24"
        };

    }

    return {
        ...styles.severity,
        background: "rgba(52,211,153,0.12)",
        color: "#34D399"
    };

}


// ======================================================
// STYLES
// ======================================================

const styles = {

    page: {
        position: "relative",
        minHeight: "100vh",
        background: "#080B12",
        color: "#F8FAFC",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#080B12"
    },

    loadingCard: {
        background: "#111824",
        padding: "45px",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 15px 40px rgba(0,0,0,0.35)"
    },

    bigEmoji: {
        fontSize: "42px"
    },

    navbar: {
        position: "relative",
        zIndex: 1,
        minHeight: "68px",
        padding: "0 40px",
        background: "rgba(17,24,36,0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #202938",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    logo: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        letterSpacing: "-0.4px"
    },

    subtitle: {
        color: "#94A3B8"
    },

    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    adminInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "3px",
        marginLeft: "8px"
    },

    refreshButton: {
        padding: "9px 15px",
        border: "1px solid #202938",
        borderRadius: "8px",
        background: "#111824",
        color: "#94A3B8",
        cursor: "pointer",
        fontWeight: "600"
    },

    logoutButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
        color: "#F8FAFC",
        cursor: "pointer",
        fontWeight: "600"
    },

    container: {
        position: "relative",
        zIndex: 1,
        maxWidth: "1200px",
        margin: "auto",
        padding: "40px 25px"
    },

    header: {
        marginBottom: "25px"
    },

    heading: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "600",
        letterSpacing: "-0.5px"
    },

    headerText: {
        color: "#94A3B8",
        marginTop: "8px"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
    },

    statCard: {
        background: "#111824",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    statIcon: {
        fontSize: "22px"
    },

    statTitle: {
        color: "#94A3B8",
        fontSize: "14px"
    },

    statNumber: {
        fontSize: "28px"
    },

    message: {
        padding: "14px",
        marginBottom: "20px",
        background: "rgba(52,211,153,0.12)",
        color: "#34D399",
        borderRadius: "8px",
        textAlign: "center"
    },

    // ==================================================
    // EMERGING ISSUES
    // ==================================================

    emergingSection: {
        background: "#111824",
        padding: "25px",
        borderRadius: "16px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)",
        border:
            "1px solid rgba(251,113,133,0.25)"
    },

    emergingHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    emergingTitle: {
        margin: 0,
        fontSize: "22px"
    },

    emergingSubtitle: {
        marginTop: "6px",
        color: "#94A3B8"
    },

    emergingBadge: {
        minWidth: "38px",
        height: "38px",
        padding: "0 10px",
        borderRadius: "16px",
        background: "rgba(251,113,133,0.12)",
        color: "#FB7185",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    emergingLoading: {
        padding: "30px",
        textAlign: "center",
        background: "#111824",
        borderRadius: "12px",
        color: "#94A3B8"
    },

    loadingIcon: {
        fontSize: "30px"
    },

    noEmergingIssues: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "20px",
        background: "rgba(52,211,153,0.08)",
        borderRadius: "12px",
        border:
            "1px solid rgba(52,211,153,0.25)"
    },

    noEmergingIcon: {
        fontSize: "28px"
    },

    noEmergingTitle: {
        margin: 0,
        color: "#34D399"
    },

    noEmergingText: {
        marginBottom: 0,
        color: "#94A3B8"
    },

    emergingGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "18px"
    },

    emergingCard: {
        padding: "20px",
        borderRadius: "13px",
        background: "rgba(251,113,133,0.08)",
        border:
            "1px solid rgba(251,113,133,0.25)"
    },

    emergingCardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },

    alertLabel: {
        fontSize: "11px",
        fontWeight: "800",
        color: "#FB7185",
        letterSpacing: "0.5px"
    },

    emergingCardTitle: {
        margin: "7px 0",
        fontSize: "18px"
    },

    severity: {
        height: "fit-content",
        padding: "6px 10px",
        borderRadius: "16px",
        fontSize: "10px",
        fontWeight: "800",
        textTransform: "uppercase"
    },

    emergingStats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "10px",
        marginTop: "20px"
    },

    emergingStat: {
        background: "#111824",
        padding: "13px 8px",
        borderRadius: "9px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    emergingDetails: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        marginTop: "13px",
        fontSize: "13px"
    },

    emergingWarning: {
        marginTop: "15px",
        padding: "12px",
        background: "rgba(251,113,133,0.08)",
        color: "#FB7185",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: "1.5"
    },

    emergingViewButton: {
        width: "100%",
        marginTop: "14px",
        padding: "10px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#FB7185",
        color: "#F8FAFC",
        cursor: "pointer",
        fontWeight: "700"
    },

    // ==================================================
    // RECURRING ISSUES
    // ==================================================

    issueSection: {
        background: "#111824",
        padding: "25px",
        borderRadius: "16px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    issueHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px"
    },

    issueTitle: {
        margin: 0,
        fontSize: "22px"
    },

    issueSubtitle: {
        color: "#94A3B8",
        lineHeight: "1.5"
    },

    issueBadge: {
        padding: "8px 12px",
        borderRadius: "16px",
        background: "rgba(139,92,246,0.12)",
        color: "#8B5CF6",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    },

    issueLoading: {
        padding: "40px",
        textAlign: "center",
        background: "#111824",
        borderRadius: "12px",
        color: "#94A3B8"
    },

    noIssues: {
        padding: "35px",
        textAlign: "center",
        background: "#111824",
        borderRadius: "12px",
        color: "#94A3B8"
    },

    noIssuesIcon: {
        fontSize: "35px"
    },

    issueGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "18px"
    },

    issueCard: {
        padding: "20px",
        borderRadius: "13px",
        background: "#111824",
        border:
            "1px solid #202938"
    },

    issueCardTop: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
    },

    issueIcon: {
        fontSize: "18px"
    },

    issueTitleContainer: {
        minWidth: 0
    },

    issueCardTitle: {
        margin: 0,
        fontSize: "18px"
    },

    issueKey: {
        display: "inline-block",
        marginTop: "5px",
        padding: "4px 7px",
        borderRadius: "8px",
        background: "#151C29",
        color: "#94A3B8",
        fontSize: "10px"
    },

    issueDescription: {
        color: "#94A3B8",
        lineHeight: "1.5"
    },

    issueCountBox: {
        padding: "15px",
        background: "rgba(139,92,246,0.10)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "15px 0"
    },

    issueCount: {
        fontSize: "28px",
        color: "#8B5CF6"
    },

    issueCountText: {
        color: "#94A3B8",
        fontSize: "13px"
    },

    issueDetails: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "10px",
        marginBottom: "15px"
    },

    issueDetailItem: {
        padding: "10px",
        background: "#111824",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    issueDates: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        padding: "8px 0",
        borderTop:
            "1px solid #202938",
        fontSize: "12px"
    },

    viewIssueButton: {
        width: "100%",
        marginTop: "15px",
        padding: "11px 15px",
        border: "none",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
        color: "#F8FAFC",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "600"
    },

    // ==================================================
    // ANALYTICS
    // ==================================================

    analyticsSection: {
        marginBottom: "30px"
    },

    analyticsHeader: {
        marginBottom: "20px"
    },

    analyticsTitle: {
        margin: 0,
        fontSize: "22px"
    },

    analyticsSubtitle: {
        color: "#94A3B8"
    },

    analyticsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px"
    },

    analyticsCard: {
        background: "#111824",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    cardDescription: {
        color: "#94A3B8",
        fontSize: "13px"
    },

    barContainer: {
        marginTop: "20px"
    },

    barHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "7px",
        fontSize: "13px"
    },

    barBackground: {
        height: "8px",
        background: "#202938",
        borderRadius: "10px",
        overflow: "hidden"
    },

    barFill: {
        height: "100%",
        background: "#8B5CF6",
        borderRadius: "10px"
    },

    workloadCard: {
        background: "#111824",
        padding: "25px",
        borderRadius: "14px",
        marginTop: "20px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    workloadHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px"
    },

    agentCount: {
        padding: "7px 10px",
        background: "#151C29",
        borderRadius: "16px",
        fontSize: "12px"
    },

    noWorkload: {
        padding: "25px",
        textAlign: "center",
        color: "#94A3B8",
        background: "#111824",
        borderRadius: "10px"
    },

    workloadGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "15px"
    },

    agentCard: {
        padding: "18px",
        border:
            "1px solid #202938",
        borderRadius: "11px",
        background: "#111824"
    },

    agentCardHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px"
    },

    agentName: {
        margin: 0
    },

    agentEmail: {
        margin: "5px 0",
        color: "#64748B",
        fontSize: "12px"
    },

    agentDepartment: {
        height: "fit-content",
        padding: "5px 8px",
        background: "rgba(139,92,246,0.12)",
        color: "#8B5CF6",
        borderRadius: "6px",
        fontSize: "10px"
    },

    workloadStats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "8px",
        marginTop: "15px"
    },

    workloadStat: {
        background: "#111824",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    // ==================================================
    // TICKETS
    // ==================================================

    ticketSection: {
        marginBottom: "40px"
    },

    ticketSectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "20px",
        marginBottom: "20px"
    },

    sectionTitle: {
        margin: 0,
        fontSize: "22px"
    },

    sectionSubtitle: {
        color: "#94A3B8"
    },

    ticketCountBadge: {
        padding: "7px 12px",
        background: "#111824",
        borderRadius: "16px",
        color: "#94A3B8",
        fontSize: "12px"
    },

    filtersCard: {
        background: "#111824",
        padding: "18px",
        borderRadius: "12px",
        marginBottom: "20px",
        display: "grid",
        gridTemplateColumns:
            "2fr repeat(4, 1fr) auto",
        gap: "10px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    searchInput: {
        padding: "11px 13px",
        border:
            "1px solid #202938",
        borderRadius: "8px",
        outline: "none",
        fontSize: "13px"
    },

    filterSelect: {
        padding: "11px 10px",
        border:
            "1px solid #202938",
        borderRadius: "8px",
        background: "#111824",
        fontSize: "13px",
        outline: "none"
    },

    clearButton: {
        padding: "11px 15px",
        border: "none",
        borderRadius: "8px",
        background: "#151C29",
        color: "#94A3B8",
        cursor: "pointer",
        fontWeight: "600"
    },

    ticketGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "20px"
    },

    ticket: {
        background: "#111824",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.35)"
    },

    ticketTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },

    ticketTitle: {
        margin: 0,
        fontSize: "19px"
    },

    status: {
        padding: "7px 12px",
        borderRadius: "16px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    },

    description: {
        color: "#94A3B8",
        lineHeight: "1.6",
        marginTop: "15px"
    },

    tags: {
        display: "flex",
        gap: "10px",
        margin: "15px 0"
    },

    category: {
        background: "rgba(139,92,246,0.12)",
        color: "#8B5CF6",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    },

    priority: {
        background: "rgba(251,113,133,0.12)",
        color: "#FB7185",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    },

    line: {
        border: "none",
        borderTop:
            "1px solid #202938",
        margin: "20px 0"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "20px",
        fontSize: "14px"
    },

    infoText: {
        margin: "7px 0 2px",
        color: "#94A3B8"
    },

    email: {
        color: "#64748B"
    },

    notAssigned: {
        color: "#94A3B8"
    },

    assignment: {
        marginTop: "20px",
        padding: "18px",
        background: "#111824",
        borderRadius: "10px"
    },

    currentAgent: {
        marginTop: "10px",
        padding: "10px",
        background: "rgba(52,211,153,0.12)",
        color: "#34D399",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "3px"
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
        padding: "10px",
        border:
            "1px solid #202938",
        borderRadius: "8px",
        background: "#111824"
    },

    assigningText: {
        display: "block",
        marginTop: "8px",
        color: "#94A3B8"
    },

    // ==================================================
    // AI
    // ==================================================

    aiBox: {
        marginTop: "20px",
        padding: "18px",
        background: "rgba(139,92,246,0.10)",
        borderRadius: "10px",
        color: "#94A3B8",
        lineHeight: "1.5"
    },

    solutionBox: {
        marginTop: "15px",
        padding: "16px",
        background: "rgba(45,212,191,0.12)",
        border:
            "1px solid rgba(45,212,191,0.3)",
        borderRadius: "10px"
    },

    solutionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px"
    },

    solutionLabel: {
        fontSize: "10px",
        fontWeight: "800",
        color: "#2DD4BF",
        letterSpacing: "0.6px"
    },

    solutionAction: {
        margin: "6px 0 0",
        fontSize: "14px",
        color: "#5EEAD4"
    },

    confidenceBadge: {
        padding: "5px 8px",
        borderRadius: "16px",
        fontSize: "10px",
        fontWeight: "700",
        whiteSpace: "nowrap",
        textTransform: "capitalize"
    },

    solutionText: {
        margin: "12px 0 0",
        color: "#94A3B8",
        fontSize: "13px",
        lineHeight: "1.6"
    },

    detectedIssueBox: {
        marginTop: "15px",
        padding: "12px",
        background: "#111824",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        color: "#8B5CF6"
    },

    // ==================================================
    // EMPTY
    // ==================================================

    empty: {
        background: "#111824",
        padding: "55px",
        textAlign: "center",
        borderRadius: "14px"
    },

    emptyIcon: {
        fontSize: "40px"
    },

    // ==================================================
    // MODAL
    // ==================================================

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background:
            "rgba(15, 23, 42, 0.62)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 9999
    },

    modal: {
        width: "100%",
        maxWidth: "850px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#111824",
        borderRadius: "16px",
        padding: "28px",
        boxShadow:
            "0 25px 70px rgba(0,0,0,0.25)"
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        paddingBottom: "20px",
        borderBottom:
            "1px solid #202938"
    },

    modalEyebrow: {
        color: "#8B5CF6",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.7px"
    },

    modalTitle: {
        margin: "7px 0",
        fontSize: "26px"
    },

    modalIssueKey: {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "6px",
        background: "#151C29",
        color: "#94A3B8",
        fontSize: "11px"
    },

    closeButton: {
        width: "36px",
        height: "36px",
        border: "none",
        borderRadius: "50%",
        background: "#151C29",
        fontSize: "24px",
        cursor: "pointer",
        lineHeight: "1"
    },

    modalSummary: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "12px",
        margin: "22px 0"
    },

    modalSummaryItem: {
        background: "#111824",
        padding: "15px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    modalSpikeBox: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        background: "rgba(251,113,133,0.08)",
        border:
            "1px solid rgba(251,113,133,0.25)",
        borderRadius: "10px",
        color: "#FB7185",
        marginBottom: "20px"
    },

    modalDescription: {
        color: "#94A3B8",
        lineHeight: "1.6",
        marginBottom: "25px"
    },

    modalTicketsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
    },

    modalTicketsHeaderH3: {
        margin: 0
    },

    modalLoading: {
        padding: "35px",
        textAlign: "center",
        color: "#94A3B8",
        background: "#111824",
        borderRadius: "10px"
    },

    modalError: {
        padding: "15px",
        background: "rgba(251,113,133,0.12)",
        color: "#FB7185",
        borderRadius: "9px"
    },

    modalEmpty: {
        padding: "35px",
        textAlign: "center",
        background: "#111824",
        color: "#94A3B8",
        borderRadius: "10px"
    },

    issueTicketList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    issueTicket: {
        display: "flex",
        gap: "14px",
        padding: "17px",
        border:
            "1px solid #202938",
        borderRadius: "12px",
        background: "#111824"
    },

    issueTicketNumber: {
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        background: "rgba(139,92,246,0.12)",
        color: "#8B5CF6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        flexShrink: 0
    },

    issueTicketContent: {
        flex: 1,
        minWidth: 0
    },

    issueTicketTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px"
    },

    issueTicketTopH4: {
        margin: 0
    },

    issueTicketDescription: {
        color: "#94A3B8",
        lineHeight: "1.5"
    },

    issueTicketMeta: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        color: "#94A3B8",
        fontSize: "12px"
    },

    modalSolution: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        marginTop: "12px",
        padding: "10px",
        background: "rgba(45,212,191,0.12)",
        borderRadius: "8px",
        color: "#2DD4BF",
        fontSize: "12px"
    }

};

export default AdminDashboard;
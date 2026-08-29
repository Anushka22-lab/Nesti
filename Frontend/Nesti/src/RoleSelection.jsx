function RoleSelection({ onCustomer, onAgent, onAdmin }) {

    return (
        <div style={styles.page}>

            <div style={styles.container}>

                {/* ============================= */}
                {/* BRAND / HERO */}
                {/* ============================= */}

                <div style={styles.brand}>

                    <h1 style={styles.logo}>
                        Nesti
                    </h1>

                    <div style={styles.tagline}>
                        AI-Powered Customer Support
                    </div>

                    <h2 style={styles.heroTitle}>
                        Turn customer problems
                        <br />
                        into actionable insights.
                    </h2>

                    <p style={styles.description}>
                        Nesti helps support teams manage customer
                        tickets, identify recurring issues, and
                        resolve problems faster with
                        AI-powered support intelligence.
                    </p>

                </div>


                {/* ============================= */}
                {/* FEATURES */}
                {/* ============================= */}

                <div style={styles.features}>

                    <div style={styles.feature}>

                        <div style={styles.icon}>
                            🎯
                        </div>

                        <div>

                            <h3 style={styles.featureTitle}>
                                Smart Ticket Management
                            </h3>

                            <p style={styles.featureText}>
                                Create, track and manage
                                customer support tickets.
                            </p>

                        </div>

                    </div>


                    <div style={styles.feature}>

                        <div style={styles.icon}>
                            🤖
                        </div>

                        <div>

                            <h3 style={styles.featureTitle}>
                                AI Issue Intelligence
                            </h3>

                            <p style={styles.featureText}>
                                Detect similar and recurring
                                customer problems automatically.
                            </p>

                        </div>

                    </div>


                    <div style={styles.feature}>

                        <div style={styles.icon}>
                            📊
                        </div>

                        <div>

                            <h3 style={styles.featureTitle}>
                                Actionable Insights
                            </h3>

                            <p style={styles.featureText}>
                                Help teams understand what is
                                affecting their customers.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ============================= */}
                {/* ROLE SELECTION */}
                {/* ============================= */}

                <div style={styles.selection}>

                    <h2 style={styles.selectionTitle}>
                        Get started with Nesti
                    </h2>

                    <p style={styles.selectionSubtitle}>
                        Choose how you want to continue
                    </p>


                    <div style={styles.roles}>

                        {/* CUSTOMER */}

                        <div style={styles.roleCard}>

                            <div style={styles.roleIcon}>
                                👤
                            </div>

                            <h3 style={styles.roleTitle}>
                                Customer
                            </h3>

                            <p style={styles.roleDescription}>
                                Create and track support tickets.
                            </p>

                            <button
                                type="button"
                                onClick={onCustomer}
                                style={styles.roleButton}
                            >
                                Continue as Customer
                            </button>

                        </div>


                        {/* AGENT */}

                        <div style={styles.roleCard}>

                            <div style={styles.roleIcon}>
                                🎧
                            </div>

                            <h3 style={styles.roleTitle}>
                                Agent
                            </h3>

                            <p style={styles.roleDescription}>
                                Resolve and manage customer issues.
                            </p>

                            <button
                                type="button"
                                onClick={onAgent}
                                style={styles.roleButton}
                            >
                                Continue as Agent
                            </button>

                        </div>


                        {/* ADMIN */}

                        <div style={styles.roleCard}>

                            <div style={styles.roleIcon}>
                                🛡️
                            </div>

                            <h3 style={styles.roleTitle}>
                                Admin
                            </h3>

                            <p style={styles.roleDescription}>
                                Manage support operations and insights.
                            </p>

                            <button
                                type="button"
                                onClick={onAdmin}
                                style={styles.roleButton}
                            >
                                Continue as Admin
                            </button>

                        </div>

                    </div>

                </div>


                {/* ============================= */}
                {/* FOOTER */}
                {/* ============================= */}

                <p style={styles.footer}>
                    Nesti · Intelligent support, simplified.
                </p>

            </div>

        </div>
    );
}


// ========================================
// STYLES
// ========================================

const styles = {

    page: {

        minHeight: "100vh",

        background: "#f5f7fb",

        padding: "50px 20px",

        boxSizing: "border-box",

        color: "#111827"

    },


    container: {

        width: "100%",

        maxWidth: "1050px",

        margin: "0 auto"

    },


    brand: {

        textAlign: "center",

        maxWidth: "750px",

        margin: "0 auto"

    },


    logo: {

        margin: 0,

        fontSize: "46px",

        fontWeight: "800",

        letterSpacing: "-2px"

    },


    tagline: {

        marginTop: "5px",

        color: "#4f46e5",

        fontSize: "15px",

        fontWeight: "600"

    },


    heroTitle: {

        marginTop: "35px",

        marginBottom: "15px",

        fontSize: "36px",

        lineHeight: "1.15",

        letterSpacing: "-1px"

    },


    description: {

        maxWidth: "650px",

        margin: "0 auto",

        color: "#6b7280",

        fontSize: "16px",

        lineHeight: "1.7"

    },


    features: {

        display: "grid",

        gridTemplateColumns:
            "repeat(3, 1fr)",

        gap: "16px",

        marginTop: "40px"

    },


    feature: {

        display: "flex",

        gap: "13px",

        padding: "20px",

        background: "white",

        borderRadius: "14px",

        boxShadow:
            "0 8px 25px rgba(0,0,0,0.05)"

    },


    icon: {

        fontSize: "25px",

        flexShrink: 0

    },


    featureTitle: {

        margin: 0,

        fontSize: "15px",

        fontWeight: "700"

    },


    featureText: {

        margin: "6px 0 0",

        fontSize: "13px",

        lineHeight: "1.5",

        color: "#6b7280"

    },


    selection: {

        marginTop: "55px",

        textAlign: "center"

    },


    selectionTitle: {

        margin: 0,

        fontSize: "25px"

    },


    selectionSubtitle: {

        marginTop: "7px",

        color: "#6b7280",

        fontSize: "14px"

    },


    roles: {

        display: "grid",

        gridTemplateColumns:
            "repeat(3, 1fr)",

        gap: "20px",

        marginTop: "25px"

    },


    roleCard: {

        padding: "30px 25px",

        background: "white",

        borderRadius: "18px",

        boxShadow:
            "0 10px 35px rgba(0,0,0,0.07)"

    },


    roleIcon: {

        fontSize: "38px"

    },


    roleTitle: {

        marginTop: "12px",

        marginBottom: "6px",

        fontSize: "19px"

    },


    roleDescription: {

        margin: 0,

        minHeight: "40px",

        color: "#6b7280",

        fontSize: "13px",

        lineHeight: "1.5"

    },


    roleButton: {

        width: "100%",

        marginTop: "20px",

        padding: "12px",

        border: "none",

        borderRadius: "9px",

        background: "#111827",

        color: "white",

        fontSize: "14px",

        fontWeight: "700",

        cursor: "pointer"

    },


    footer: {

        marginTop: "45px",

        textAlign: "center",

        color: "#9ca3af",

        fontSize: "12px"

    }

};


export default RoleSelection;
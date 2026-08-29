import GalaxyBackground from "./components/GalaxyBackground";
import SignalGraphic from "./components/SignalGraphic";
import ProblemSection from "./components/ProblemSection";
import SignalFlowSection from "./components/SignalFlowSection";
import TicketIntelligenceSection from "./components/TicketIntelligenceSection";
import PatternDetectionSection from "./components/PatternDetectionSection";
import RecommendationSection from "./components/RecommendationSection";
import AssignmentSection from "./components/AssignmentSection";
import LiveSupportSection from "./components/LiveSupportSection";
import AdminIntelligenceSection from "./components/AdminIntelligenceSection";

function RoleSelection({ onCustomer, onAgent, onAdmin }) {

    return (
        <div style={styles.page}>

            <GalaxyBackground />

            {/* Ambient luxury glows */}
            <div style={styles.ambientGlowOne} />
            <div style={styles.ambientGlowTwo} />

            <div style={styles.container}>

                {/* =====================================================
                    PREMIUM NAV
                ===================================================== */}

                <header style={{ ...styles.navRow, ...anim(0) }}>

                    <div style={styles.brandBlock}>
                        <div style={styles.brandLogo}>
                            N
                        </div>

                        <div>
                            <div style={styles.wordmark}>
                                NESTI
                            </div>

                            <div style={styles.brandSubtitle}>
                                AI-POWERED SUPPORT INTELLIGENCE
                            </div>
                        </div>
                    </div>

                    <div style={styles.navTag}>
                        <span style={styles.liveDot} />
                        AI Support Intelligence
                    </div>

                </header>


                {/* =====================================================
                    HERO
                ===================================================== */}

                <main>

                    <section style={styles.hero} className="nesti-landing-hero">

                        <div style={{ ...styles.heroText, ...anim(1) }}>

                            <div style={styles.eyebrow}>
                                <span style={styles.eyebrowLine} />
                                <span style={styles.eyebrowDot} />
                                INTELLIGENCE FOR EVERY SUPPORT CONVERSATION
                            </div>

                            <div style={styles.heroBrand}>
                                <div style={styles.heroBrandGlow}>
                                    NESTI
                                </div>

                                <div style={styles.heroBrandCaption}>
                                    AI-POWERED SUPPORT INTELLIGENCE
                                </div>
                            </div>

                            <h1 style={styles.heroTitle}>
                                Scattered complaints,
                                <br />
                                <span style={styles.heroTitleAccent}>
                                    one clear signal.
                                </span>
                            </h1>

                            <p style={styles.description}>
                                Nesti reads every ticket that comes in, understands
                                what customers are actually experiencing, connects
                                related problems, and surfaces what matters —
                                before a small issue becomes a serious incident.
                            </p>

                            <div style={styles.heroActions}>
                                <button
                                    type="button"
                                    onClick={onCustomer}
                                    style={styles.primaryHeroButton}
                                    className="nesti-btn nesti-sweep-btn"
                                >
                                    Explore Nesti
                                    <span style={styles.buttonArrow}>→</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={onAgent}
                                    style={styles.secondaryHeroButton}
                                    className="nesti-btn"
                                >
                                    See it in action
                                    <span style={styles.playCircle}>▶</span>
                                </button>
                            </div>

                            <div style={styles.heroStats}>

                                <div style={styles.heroStat}>
                                    <strong style={styles.heroStatNumber}>
                                        1,240+
                                    </strong>
                                    <span style={styles.heroStatLabel}>
                                        tickets analyzed daily
                                    </span>
                                </div>

                                <div style={styles.heroStatDivider} />

                                <div style={styles.heroStat}>
                                    <strong style={styles.heroStatNumber}>
                                        &lt; 2 min
                                    </strong>
                                    <span style={styles.heroStatLabel}>
                                        to surface a recurring issue
                                    </span>
                                </div>

                                <div style={styles.heroStatDivider} />

                                <div style={styles.heroStat}>
                                    <strong style={styles.heroStatNumber}>
                                        Real-time
                                    </strong>
                                    <span style={styles.heroStatLabel}>
                                        support intelligence
                                    </span>
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SIGNAL VISUAL
                        ================================================= */}

                        <div style={{ ...styles.heroVisual, ...anim(2) }}>

                            <div style={styles.visualOrbitalRing} />
                            <div style={styles.visualOrbitalRingTwo} />

                            <SignalGraphic />

                            <div style={styles.heroVisualCaption}>
                                <span style={styles.captionDot} />
                                Nesti connects the dots
                            </div>

                            <div style={styles.visualMiniLabel}>
                                8 related tickets → 1 detected issue
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        CAPABILITY STRIP
                    ================================================= */}

                    <section
                        style={{ ...styles.strip, ...anim(3) }}
                        className="nesti-landing-strip"
                    >

                        {[
                            {
                                mark: "01",
                                accent: "#8B5CF6",
                                title: "Ticket management",
                                text: "Every conversation, organized and searchable — nothing falls through."
                            },
                            {
                                mark: "02",
                                accent: "#2DD4BF",
                                title: "Issue intelligence",
                                text: "Nesti clusters similar tickets automatically and flags spikes as they form."
                            },
                            {
                                mark: "03",
                                accent: "#D6B98C",
                                title: "Recommended fixes",
                                text: "Agents see what's likely wrong, what to investigate, and what to do next."
                            }
                        ].map((f) => (
                            <div key={f.mark} style={styles.stripItem} className="nesti-card-hover">

                                <div
                                    style={{
                                        ...styles.stripMark,
                                        color: f.accent,
                                        borderColor: `${f.accent}55`,
                                        boxShadow: `0 0 20px ${f.accent}12`
                                    }}
                                >
                                    {f.mark}
                                </div>

                                <div>
                                    <h3 style={styles.stripTitle}>
                                        {f.title}
                                    </h3>

                                    <p style={styles.stripText}>
                                        {f.text}
                                    </p>
                                </div>

                            </div>
                        ))}

                    </section>


                    {/* =================================================
                        PRODUCT STORY
                    ================================================= */}

                    <div style={styles.sectionIntro}>

                        <span style={styles.sectionKicker}>
                            THE NESTI INTELLIGENCE LAYER
                        </span>

                        <h2 style={styles.sectionHeading}>
                            From every ticket
                            <br />
                            to the bigger picture.
                        </h2>

                        <p style={styles.sectionDescription}>
                            Nesti turns support activity into operational
                            intelligence — automatically.
                        </p>

                    </div>

                    <ProblemSection />
                    <SignalFlowSection />
                    <TicketIntelligenceSection />
                    <PatternDetectionSection />
                    <RecommendationSection />
                    <AssignmentSection />
                    <LiveSupportSection />
                    <AdminIntelligenceSection />


                    {/* =================================================
                        ROLE SELECTION
                    ================================================= */}

                    <section
                        style={{
                            ...styles.selection,
                            ...anim(4)
                        }}
                    >

                        <div style={styles.selectionEyebrow}>
                            <span style={styles.selectionLine} />
                            GET STARTED
                            <span style={styles.selectionLine} />
                        </div>

                        <div style={styles.selectionBrand}>
                            NESTI
                        </div>

                        <h2 style={styles.selectionTitle}>
                            Intelligence starts here.
                        </h2>

                        <p style={styles.selectionSubtitle}>
                            Choose how you want to experience Nesti.
                        </p>

                        <div style={styles.roles} className="nesti-stagger">

                            {[
                                {
                                    key: "customer",
                                    number: "01",
                                    title: "Customer",
                                    desc: "Create and track your support tickets.",
                                    action: onCustomer
                                },
                                {
                                    key: "agent",
                                    number: "02",
                                    title: "Agent",
                                    desc: "Resolve tickets with AI-backed context.",
                                    action: onAgent
                                },
                                {
                                    key: "admin",
                                    number: "03",
                                    title: "Admin",
                                    desc: "Oversee operations and AI insights.",
                                    action: onAdmin
                                }
                            ].map((r) => (

                                <div
                                    key={r.key}
                                    style={styles.roleCard}
                                    className="nesti-card-hover"
                                >

                                    <div style={styles.roleTop}>
                                        <span style={styles.roleNumber}>
                                            {r.number}
                                        </span>

                                        <span style={styles.roleAccess}>
                                            ACCESS
                                        </span>
                                    </div>

                                    <div style={styles.roleMark}>
                                        {r.title.charAt(0)}
                                    </div>

                                    <h3 style={styles.roleTitle}>
                                        {r.title}
                                    </h3>

                                    <p style={styles.roleDescription}>
                                        {r.desc}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={r.action}
                                        style={styles.roleButton}
                                        className="nesti-btn nesti-sweep-btn"
                                    >
                                        Continue as {r.title}
                                        <span>→</span>
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>

                </main>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer style={{ ...styles.footer, ...anim(5) }}>

                    <div style={styles.footerBrand}>
                        NESTI
                    </div>

                    <span style={styles.footerDivider}>·</span>

                    <span>
                        Intelligent support, simplified.
                    </span>

                    <span style={styles.footerDivider}>·</span>

                    <span>
                        AI-powered.
                    </span>

                </footer>

            </div>
        </div>
    );
}


// ======================================================
// ANIMATION HELPER
// ======================================================

const anim = (i) => ({
    animation:
        `nesti-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both`,
    animationDelay: `${i * 0.1}s`
});


// ======================================================
// STYLES
// ======================================================

const styles = {

    page: {
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#080B12",
        padding: "0 24px 80px",
        boxSizing: "border-box",
        color: "#F8FAFC",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    ambientGlowOne: {
        position: "fixed",
        width: "520px",
        height: "520px",
        left: "-280px",
        top: "8%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 68%)",
        pointerEvents: "none",
        zIndex: 0
    },

    ambientGlowTwo: {
        position: "fixed",
        width: "600px",
        height: "600px",
        right: "-330px",
        top: "34%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,212,191,0.055), transparent 68%)",
        pointerEvents: "none",
        zIndex: 0
    },

    container: {
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "1180px",
        margin: "0 auto"
    },


    // ======================================================
    // NAV
    // ======================================================

    navRow: {
        minHeight: "112px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(148,163,184,0.08)"
    },

    brandBlock: {
        display: "flex",
        alignItems: "center",
        gap: "13px"
    },

    brandLogo: {
        width: "35px",
        height: "35px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(45,212,191,0.12))",
        border: "1px solid rgba(139,92,246,0.35)",
        color: "#C4B5FD",
        fontSize: "17px",
        fontWeight: "800",
        boxShadow: "0 0 25px rgba(139,92,246,0.12)"
    },

    wordmark: {
        fontSize: "20px",
        lineHeight: "1",
        fontWeight: "800",
        letterSpacing: "3px",
        color: "#F8FAFC"
    },

    brandSubtitle: {
        marginTop: "5px",
        fontSize: "7px",
        fontWeight: "600",
        letterSpacing: "2px",
        color: "#64748B"
    },

    navTag: {
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        padding: "9px 13px",
        borderRadius: "999px",
        border: "1px solid rgba(148,163,184,0.12)",
        background: "rgba(14,20,32,0.55)",
        backdropFilter: "blur(12px)",
        color: "#718096",
        fontSize: "11px",
        letterSpacing: "0.3px"
    },

    liveDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#2DD4BF",
        boxShadow: "0 0 10px rgba(45,212,191,0.9)",
        animation: "nesti-pulse 2s ease-in-out infinite"
    },


    // ======================================================
    // HERO
    // ======================================================

    hero: {
        minHeight: "680px",
        display: "grid",
        gridTemplateColumns: "1fr 0.94fr",
        gap: "46px",
        alignItems: "center",
        padding: "74px 0 58px"
    },

    heroText: {
        maxWidth: "650px"
    },

    eyebrow: {
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        marginBottom: "22px",
        color: "#A78BFA",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "1.5px"
    },

    eyebrowLine: {
        width: "20px",
        height: "1px",
        background: "linear-gradient(90deg, #8B5CF6, #2DD4BF)"
    },

    eyebrowDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: "#2DD4BF",
        boxShadow: "0 0 9px #2DD4BF",
        animation: "nesti-pulse 2s ease-in-out infinite"
    },

    heroBrand: {
        marginBottom: "19px"
    },

    heroBrandGlow: {
        fontSize: "clamp(64px, 9vw, 108px)",
        lineHeight: "0.82",
        fontWeight: "800",
        letterSpacing: "-6px",
        background: "linear-gradient(105deg, #F8FAFC 0%, #C4B5FD 28%, #8B5CF6 58%, #2DD4BF 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 28px rgba(139,92,246,0.18))"
    },

    heroBrandCaption: {
        marginTop: "15px",
        paddingLeft: "5px",
        color: "#64748B",
        fontSize: "9px",
        fontWeight: "700",
        letterSpacing: "4px"
    },

    heroTitle: {
        margin: "0 0 20px",
        fontSize: "clamp(38px, 4.2vw, 56px)",
        fontWeight: "600",
        lineHeight: "1.06",
        letterSpacing: "-2.2px",
        color: "#F8FAFC"
    },

    heroTitleAccent: {
        background: "linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 55%, #2DD4BF 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },

    description: {
        maxWidth: "575px",
        margin: "0 0 29px",
        color: "#94A3B8",
        fontSize: "15px",
        lineHeight: "1.75",
        letterSpacing: "-0.1px"
    },

    heroActions: {
        display: "flex",
        gap: "12px",
        marginBottom: "38px",
        flexWrap: "wrap"
    },

    primaryHeroButton: {
        position: "relative",
        minWidth: "168px",
        padding: "13px 17px",
        border: "0",
        borderRadius: "10px",
        background: "linear-gradient(110deg, #8B5CF6, #7C3AED 55%, #2DD4BF)",
        color: "#FFFFFF",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 10px 35px rgba(124,58,237,0.2)"
    },

    secondaryHeroButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        minWidth: "155px",
        padding: "12px 17px",
        border: "1px solid #253044",
        borderRadius: "10px",
        background: "rgba(14,20,32,0.7)",
        color: "#E2E8F0",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer"
    },

    buttonArrow: {
        marginLeft: "18px",
        fontSize: "17px"
    },

    playCircle: {
        width: "19px",
        height: "19px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #334155",
        borderRadius: "50%",
        fontSize: "7px",
        color: "#A78BFA"
    },

    heroStats: {
        display: "flex",
        alignItems: "center",
        gap: "22px",
        flexWrap: "wrap"
    },

    heroStat: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    heroStatNumber: {
        fontSize: "19px",
        fontWeight: "750",
        color: "#F8FAFC"
    },

    heroStatLabel: {
        fontSize: "11px",
        color: "#64748B"
    },

    heroStatDivider: {
        width: "1px",
        height: "31px",
        background: "#202938"
    },


    // ======================================================
    // VISUAL
    // ======================================================

    heroVisual: {
        position: "relative",
        minHeight: "470px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        background: "radial-gradient(circle at center, rgba(139,92,246,0.075), transparent 64%)"
    },

    visualOrbitalRing: {
        position: "absolute",
        width: "410px",
        height: "410px",
        border: "1px solid rgba(139,92,246,0.09)",
        borderRadius: "50%",
        animation: "nesti-spin 38s linear infinite"
    },

    visualOrbitalRingTwo: {
        position: "absolute",
        width: "290px",
        height: "290px",
        border: "1px dashed rgba(45,212,191,0.1)",
        borderRadius: "50%",
        animation: "nesti-spin 25s linear infinite reverse"
    },

    heroVisualCaption: {
        position: "absolute",
        left: "50%",
        bottom: "36px",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        whiteSpace: "nowrap",
        fontSize: "11px",
        color: "#94A3B8"
    },

    captionDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: "#2DD4BF",
        boxShadow: "0 0 8px #2DD4BF"
    },

    visualMiniLabel: {
        position: "absolute",
        right: "0",
        bottom: "0",
        fontSize: "10px",
        color: "#475569",
        letterSpacing: "0.2px"
    },


    // ======================================================
    // CAPABILITY STRIP
    // ======================================================

    strip: {
        padding: "33px 0 37px",
        borderTop: "1px solid #151C29",
        borderBottom: "1px solid #151C29",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "36px"
    },

    stripItem: {
        display: "flex",
        gap: "15px",
        alignItems: "flex-start",
        padding: "12px",
        borderRadius: "12px"
    },

    stripMark: {
        fontSize: "10px",
        fontWeight: "800",
        fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
        border: "1px solid",
        borderRadius: "6px",
        padding: "5px 7px",
        flexShrink: 0,
        marginTop: "1px"
    },

    stripTitle: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "650",
        color: "#F8FAFC",
        letterSpacing: "-0.2px"
    },

    stripText: {
        margin: "6px 0 0",
        fontSize: "12.5px",
        lineHeight: "1.65",
        color: "#64748B"
    },


    // ======================================================
    // SECTION INTRO
    // ======================================================

    sectionIntro: {
        maxWidth: "620px",
        margin: "150px auto 76px",
        textAlign: "center"
    },

    sectionKicker: {
        color: "#8B5CF6",
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "2.5px"
    },

    sectionHeading: {
        margin: "17px 0 14px",
        fontSize: "42px",
        lineHeight: "1.08",
        letterSpacing: "-1.7px",
        fontWeight: "600",
        color: "#F8FAFC"
    },

    sectionDescription: {
        margin: 0,
        color: "#64748B",
        fontSize: "14px"
    },


    // ======================================================
    // ROLE SELECTION
    // ======================================================

    selection: {
        marginTop: "160px",
        paddingTop: "72px",
        borderTop: "1px solid #151C29",
        textAlign: "center"
    },

    selectionEyebrow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        color: "#64748B",
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "2.5px"
    },

    selectionLine: {
        width: "38px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, #8B5CF6)"
    },

    selectionBrand: {
        marginTop: "22px",
        fontSize: "48px",
        lineHeight: "1",
        fontWeight: "800",
        letterSpacing: "8px",
        background: "linear-gradient(100deg, #C4B5FD, #8B5CF6, #2DD4BF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },

    selectionTitle: {
        margin: "17px 0 7px",
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.8px",
        color: "#F8FAFC"
    },

    selectionSubtitle: {
        margin: 0,
        color: "#64748B",
        fontSize: "13px"
    },

    roles: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginTop: "35px",
        textAlign: "left"
    },

    roleCard: {
        position: "relative",
        padding: "24px",
        background: "linear-gradient(145deg, rgba(17,24,36,0.96), rgba(11,16,28,0.96))",
        border: "1px solid #202938",
        borderRadius: "16px",
        overflow: "hidden"
    },

    roleTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    roleNumber: {
        color: "#8B5CF6",
        fontSize: "10px",
        fontWeight: "800",
        fontFamily: "ui-monospace, monospace",
        letterSpacing: "1px"
    },

    roleAccess: {
        color: "#475569",
        fontSize: "8px",
        fontWeight: "700",
        letterSpacing: "1.5px"
    },

    roleMark: {
        width: "40px",
        height: "40px",
        marginTop: "28px",
        borderRadius: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, rgba(139,92,246,0.16), rgba(45,212,191,0.06))",
        border: "1px solid rgba(139,92,246,0.25)",
        color: "#C4B5FD",
        fontWeight: "700",
        fontSize: "15px"
    },

    roleTitle: {
        margin: "17px 0 6px",
        fontSize: "17px",
        fontWeight: "650",
        color: "#F8FAFC"
    },

    roleDescription: {
        margin: 0,
        minHeight: "40px",
        color: "#64748B",
        fontSize: "12.5px",
        lineHeight: "1.6"
    },

    roleButton: {
        width: "100%",
        marginTop: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 13px",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: "9px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.16), rgba(124,58,237,0.08))",
        color: "#C4B5FD",
        fontSize: "12px",
        fontWeight: "650",
        cursor: "pointer"
    },


    // ======================================================
    // FOOTER
    // ======================================================

    footer: {
        marginTop: "86px",
        paddingTop: "25px",
        borderTop: "1px solid #111824",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "9px",
        color: "#475569",
        fontSize: "10px",
        letterSpacing: "0.2px"
    },

    footerBrand: {
        color: "#94A3B8",
        fontWeight: "800",
        letterSpacing: "2px"
    },

    footerDivider: {
        color: "#263143"
    }

};


export default RoleSelection;

import { useState } from "react";
import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import AnimatedNumber from "./AnimatedNumber";
import { color, radius, shadow } from "../theme";

const CLUSTER_TICKETS = ["I can't login", "Login stopped working", "Unable to sign in"];

function PatternDetectionSection() {

    // Drives the AnimatedNumber count-up and the bar comparison the
    // moment the analytics card scrolls into view.
    const [statsVisible, setStatsVisible] = useState(false);

    return (
        <SectionShell
            eyebrow="Recurring & emerging issue detection"
            title="Three tickets become one issue. One issue becomes a warning."
            description="Individually, none of these tickets would trip an alert. Together, they're a login system failing in real time — and Nesti flags it while it's still five tickets, not five hundred."
            visual={
                <div style={styles.row} className="nesti-pattern-row">

                    {/* clustering */}
                    <div style={styles.clusterCol}>
                        {CLUSTER_TICKETS.map((t, i) => (
                            <ScrollReveal key={t} delay={0.1 * i} direction="left" distance={16}>
                                <div style={styles.miniTicket}>{t}</div>
                            </ScrollReveal>
                        ))}
                        <ScrollReveal delay={0.45} distance={16}>
                            <div style={styles.clusterResult}>
                                <span style={styles.clusterResultTitle}>Account login failure</span>
                                <span style={styles.clusterResultMeta}>5 related tickets</span>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* emerging issue analytics */}
                    <AnalyticsCard visible={statsVisible} onEnter={() => setStatsVisible(true)} />

                </div>
            }
        />
    );

}

// Separated so its own IntersectionObserver can flip statsVisible without
// re-running ScrollReveal's transform logic for the whole row.
function AnalyticsCard({ visible, onEnter }) {

    return (
        <ScrollReveal delay={0.3} onVisible={onEnter}>
            <div style={styles.analyticsCard}>

                <div style={styles.analyticsHeader}>
                    <span style={styles.analyticsTitle}>Account login failure</span>
                    <span style={styles.statusBadge}>EMERGING ISSUE</span>
                </div>

                <div style={styles.barRow}>
                    <div style={styles.barGroup}>
                        <div style={styles.barTrack}>
                            <div style={{ ...styles.bar, width: visible ? "12%" : "0%", background: color.textMuted }} />
                        </div>
                        <span style={styles.barLabel}>Previous · 0</span>
                    </div>
                    <div style={styles.barGroup}>
                        <div style={styles.barTrack}>
                            <div style={{ ...styles.bar, width: visible ? "100%" : "0%", background: color.champagne }} />
                        </div>
                        <span style={styles.barLabel}>Current · 5</span>
                    </div>
                </div>

                <div style={styles.increaseRow}>
                    <span style={styles.increaseNumber}>
                        +<AnimatedNumber value={visible ? 100 : 0} />%
                    </span>
                    <span style={styles.increaseLabel}>increase in the last hour</span>
                </div>

            </div>
        </ScrollReveal>
    );

}

const styles = {

    row: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px",
        alignItems: "stretch"
    },

    clusterCol: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    miniTicket: {
        padding: "12px 15px",
        borderRadius: radius.sm,
        background: color.surface,
        border: `1px solid ${color.border}`,
        color: color.textSecondary,
        fontSize: "13px"
    },

    clusterResult: {
        marginTop: "6px",
        padding: "16px 18px",
        borderRadius: radius.md,
        background: color.tealBg,
        border: `1px solid ${color.tealBorder}`,
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    clusterResultTitle: {
        fontSize: "14.5px",
        fontWeight: 600,
        color: color.tealSoft
    },

    clusterResultMeta: {
        fontSize: "12.5px",
        color: color.textSecondary
    },

    analyticsCard: {
        padding: "24px",
        borderRadius: radius.lg,
        background: color.card,
        border: `1px solid ${color.border}`,
        boxShadow: shadow.elevated,
        display: "flex",
        flexDirection: "column",
        gap: "22px"
    },

    analyticsHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    analyticsTitle: {
        fontSize: "14.5px",
        fontWeight: 600,
        color: color.text
    },

    statusBadge: {
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        color: color.champagne,
        background: color.champagneBg,
        border: `1px solid rgba(214,185,140,0.3)`,
        borderRadius: radius.pill,
        padding: "4px 9px"
    },

    barRow: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    barGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    barTrack: {
        height: "8px",
        borderRadius: radius.pill,
        background: color.surface,
        overflow: "hidden"
    },

    bar: {
        height: "100%",
        borderRadius: radius.pill,
        transition: "width 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s"
    },

    barLabel: {
        fontSize: "12px",
        color: color.textMuted
    },

    increaseRow: {
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        paddingTop: "4px",
        borderTop: `1px solid ${color.border}`
    },

    increaseNumber: {
        fontSize: "22px",
        fontWeight: 700,
        color: color.champagne
    },

    increaseLabel: {
        fontSize: "12.5px",
        color: color.textSecondary
    }

};

export default PatternDetectionSection;

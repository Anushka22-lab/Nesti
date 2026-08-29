import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import { color, radius } from "../theme";

// The tickets your team actually sees, on the left, loose and unrelated.
// A beat later the same five collapse into the one sentence that
// actually matters, on the right. No chart — the contrast is the point.

const RAW_TICKETS = [
    "Can't log into my account",
    "Payment failed at checkout",
    "App crashes on the settings page",
    "Unable to sign in since yesterday",
    "Password reset link doesn't work"
];

function ProblemSection() {

    return (
        <SectionShell
            eyebrow="The problem isn't the tickets"
            title={<>Your team sees tickets.<br />Nesti sees patterns.</>}
            description="Each ticket looks like its own one-off problem. Read on its own, a login complaint is just a login complaint. Nesti reads all of them together — and three of these are the same outage."
            visual={
                <div style={styles.grid} className="nesti-problem-grid">

                    <div style={styles.column}>
                        <span style={styles.columnLabel}>What lands in the queue</span>
                        {RAW_TICKETS.map((t, i) => (
                            <ScrollReveal key={t} delay={0.08 * i} direction="left">
                                <div style={styles.rawTicket}>{t}</div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.5} direction="none" style={styles.arrowWrap} className="nesti-problem-arrow">
                        <div style={styles.arrow} className="nesti-problem-arrow-icon">→</div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.65}>
                        <div style={styles.column}>
                            <span style={styles.columnLabel}>What Nesti tells your team</span>
                            <div style={styles.signal}>
                                <span style={styles.signalTag}>RECURRING ISSUE</span>
                                <h3 style={styles.signalTitle}>Account login failure</h3>
                                <p style={styles.signalMeta}>5 related tickets · started 40 minutes ago</p>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            }
        />
    );

}

const styles = {

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "28px",
        alignItems: "center"
    },

    column: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    columnLabel: {
        fontSize: "11.5px",
        fontWeight: 600,
        letterSpacing: "0.4px",
        color: color.textMuted,
        textTransform: "uppercase",
        marginBottom: "4px"
    },

    rawTicket: {
        padding: "13px 16px",
        borderRadius: radius.sm,
        background: color.surface,
        border: `1px solid ${color.border}`,
        color: color.textSecondary,
        fontSize: "13.5px"
    },

    arrowWrap: {
        display: "flex",
        justifyContent: "center"
    },

    arrow: {
        fontSize: "22px",
        color: color.lavenderSoft
    },

    signal: {
        padding: "24px",
        borderRadius: radius.md,
        background: `linear-gradient(160deg, ${color.lavenderBg}, transparent)`,
        border: `1px solid ${color.lavenderBorder}`,
        boxShadow: "0 0 0 1px rgba(139,92,246,0.08), 0 20px 44px rgba(139,92,246,0.1)"
    },

    signalTag: {
        display: "inline-block",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        color: color.lavenderHighlight,
        marginBottom: "10px"
    },

    signalTitle: {
        margin: "0 0 8px",
        fontSize: "20px",
        fontWeight: 600,
        color: color.text
    },

    signalMeta: {
        margin: 0,
        fontSize: "13px",
        color: color.textSecondary
    }

};

export default ProblemSection;

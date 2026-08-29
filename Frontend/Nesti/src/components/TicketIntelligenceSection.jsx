import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import { color, radius, shadow } from "../theme";

const FIELDS = [
    { label: "Category", value: "Account", tone: color.lavenderHighlight },
    { label: "Priority", value: "High", tone: color.danger },
    { label: "Intent", value: "Unable to access account", tone: color.text },
    { label: "Department", value: "Account Support", tone: color.text },
    { label: "Recurring issue", value: "Account login failure", tone: color.teal }
];

function TicketIntelligenceSection() {

    return (
        <SectionShell
            eyebrow="AI ticket intelligence"
            title="Every ticket, read in context."
            description="Nesti doesn't just log the words a customer typed. It reads intent, checks it against everything else coming in, and hands your team a ticket that already has answers attached."
            visual={
                <div style={styles.card} className="nesti-ticket-card">

                    <ScrollReveal>
                        <div style={styles.messageBlock}>
                            <span style={styles.messageLabel}>Customer</span>
                            <p style={styles.messageText}>
                                "I've tried logging in three times now and it keeps rejecting my password.
                                I know it's correct, I use it every day."
                            </p>
                        </div>
                    </ScrollReveal>

                    <div style={styles.divider} />

                    <ScrollReveal delay={0.15}>
                        <span style={styles.analyzedLabel}>Nesti analyzes</span>
                    </ScrollReveal>

                    <div style={styles.fieldGrid} className="nesti-ticket-fields">
                        {FIELDS.map((f, i) => (
                            <ScrollReveal key={f.label} delay={0.25 + i * 0.12} distance={14}>
                                <div style={styles.field}>
                                    <span style={styles.fieldLabel}>{f.label}</span>
                                    <span style={{ ...styles.fieldValue, color: f.tone }}>{f.value}</span>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                </div>
            }
        />
    );

}

const styles = {

    card: {
        maxWidth: "560px",
        padding: "28px",
        background: color.card,
        border: `1px solid ${color.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.elevated
    },

    messageBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    messageLabel: {
        fontSize: "11.5px",
        fontWeight: 600,
        letterSpacing: "0.4px",
        color: color.textMuted,
        textTransform: "uppercase"
    },

    messageText: {
        margin: 0,
        fontSize: "14.5px",
        lineHeight: 1.65,
        color: color.textSecondary,
        fontStyle: "italic"
    },

    divider: {
        height: "1px",
        background: color.border,
        margin: "22px 0 18px"
    },

    analyzedLabel: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: 600,
        color: color.lavenderSoft,
        letterSpacing: "0.3px",
        marginBottom: "16px"
    },

    fieldGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px 20px"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },

    fieldLabel: {
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.4px",
        color: color.textMuted,
        textTransform: "uppercase"
    },

    fieldValue: {
        fontSize: "14.5px",
        fontWeight: 600
    }

};

export default TicketIntelligenceSection;

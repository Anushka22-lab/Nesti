import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import AIOrb from "./AIOrb";
import { color, radius, shadow } from "../theme";

const STEPS = [
    "Verify account status and authentication logs",
    "Check recent authentication failures",
    "Guide the customer through a password reset if required"
];

function RecommendationSection() {

    return (
        <SectionShell
            eyebrow="AI recommended solution"
            title="Not just a flag. A first move."
            description="When Nesti hands a ticket to an agent, it comes with a starting point — based on what's worked on this exact issue before, not a generic help-article link."
            visual={
                <div style={styles.card}>

                    <div style={styles.header}>
                        <AIOrb size={30} />
                        <div>
                            <span style={styles.headerTitle}>AI recommended solution</span>
                            <span style={styles.headerSub}>Account login failure</span>
                        </div>
                        <span style={styles.confidence}>HIGH CONFIDENCE</span>
                    </div>

                    <div style={styles.steps}>
                        {STEPS.map((s, i) => (
                            <ScrollReveal key={s} delay={0.15 + i * 0.14} distance={12}>
                                <div style={styles.step}>
                                    <span style={styles.stepIndex}>{i + 1}</span>
                                    <span style={styles.stepText}>{s}</span>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.65}>
                        <div style={styles.actionRow}>
                            <span style={styles.actionLabel}>Recommended first action</span>
                            <span style={styles.actionValue}>Verify account status and authentication logs</span>
                        </div>
                    </ScrollReveal>

                </div>
            }
        />
    );

}

const styles = {

    card: {
        maxWidth: "560px",
        padding: "26px",
        borderRadius: radius.lg,
        background: color.card,
        border: `1px solid ${color.lavenderBorder}`,
        boxShadow: shadow.glowLavender
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "22px"
    },

    headerTitle: {
        display: "block",
        fontSize: "14.5px",
        fontWeight: 600,
        color: color.text
    },

    headerSub: {
        display: "block",
        fontSize: "12.5px",
        color: color.textMuted,
        marginTop: "2px"
    },

    confidence: {
        marginLeft: "auto",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        color: color.success,
        background: color.successBg,
        border: "1px solid rgba(52,211,153,0.3)",
        borderRadius: radius.pill,
        padding: "4px 9px",
        whiteSpace: "nowrap"
    },

    steps: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "20px"
    },

    step: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
    },

    stepIndex: {
        flexShrink: 0,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 700,
        color: color.lavenderHighlight,
        background: color.lavenderBg,
        border: `1px solid ${color.lavenderBorder}`,
        marginTop: "1px"
    },

    stepText: {
        fontSize: "13.5px",
        lineHeight: 1.55,
        color: color.textSecondary
    },

    actionRow: {
        paddingTop: "18px",
        borderTop: `1px solid ${color.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    actionLabel: {
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.4px",
        color: color.textMuted,
        textTransform: "uppercase"
    },

    actionValue: {
        fontSize: "14px",
        fontWeight: 600,
        color: color.text
    }

};

export default RecommendationSection;

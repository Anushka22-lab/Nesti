import { useState } from "react";
import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import { color, radius, shadow, statusStyle } from "../theme";

const STATUSES = ["OPEN", "IN PROGRESS", "RESOLVED"];

function LiveSupportSection() {

    const [step, setStep] = useState(0);

    const runSequence = () => {
        setTimeout(() => setStep(1), 900);
        setTimeout(() => setStep(2), 2200);
    };

    return (
        <SectionShell
            eyebrow="Real-time support"
            title="The conversation, not just the ticket."
            description="Customers and agents talk in the same thread Nesti is already reading — so context never gets lost between the AI's analysis and the human's reply."
            visual={
                <ScrollReveal onVisible={runSequence}>
                    <div style={styles.card}>

                        <div style={styles.header}>
                            <span style={styles.headerTitle}>Account login failure</span>
                            <span style={{ ...styles.statusChip, ...statusChipStyle(STATUSES[step]) }}>
                                <span style={styles.liveDot} />
                                {STATUSES[step]}
                            </span>
                        </div>

                        <div style={styles.thread}>
                            <div style={{ ...styles.bubble, ...styles.bubbleCustomer }}>
                                <span style={styles.bubbleAuthor}>Customer</span>
                                I still can't get in — tried resetting my password twice.
                            </div>
                            <div style={{ ...styles.bubble, ...styles.bubbleAgent }}>
                                <span style={styles.bubbleAuthor}>Simran · Agent</span>
                                I can see the failed attempts on our end. Resetting your session now — try logging in again in about a minute.
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            }
        />
    );

}

function statusChipStyle(status) {
    const s = statusStyle(status);
    return { color: s.color, background: s.background, border: `1px solid ${s.border}` };
}

const styles = {

    card: {
        maxWidth: "560px",
        borderRadius: radius.lg,
        background: color.card,
        border: `1px solid ${color.border}`,
        boxShadow: shadow.elevated,
        overflow: "hidden"
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 22px",
        borderBottom: `1px solid ${color.border}`
    },

    headerTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: color.text
    },

    statusChip: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        borderRadius: radius.pill,
        padding: "5px 10px",
        transition: "color 0.4s ease, background 0.4s ease, border-color 0.4s ease"
    },

    liveDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: "currentColor",
        animation: "nesti-pulse 1.6s ease-in-out infinite"
    },

    thread: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px 22px"
    },

    bubble: {
        maxWidth: "82%",
        padding: "12px 15px",
        borderRadius: radius.md,
        fontSize: "13.5px",
        lineHeight: 1.55,
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    bubbleAuthor: {
        fontSize: "11px",
        fontWeight: 600,
        color: color.textMuted
    },

    bubbleCustomer: {
        alignSelf: "flex-start",
        background: color.surface,
        border: `1px solid ${color.border}`,
        color: color.textSecondary
    },

    bubbleAgent: {
        alignSelf: "flex-end",
        background: color.lavenderBg,
        border: `1px solid ${color.lavenderBorder}`,
        color: color.text
    }

};

export default LiveSupportSection;

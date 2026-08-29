import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import { color, radius } from "../theme";

const NODES = [
    { label: "New ticket", detail: "\u201cCan't log into my account\u201d" },
    { label: "AI analysis", detail: "Category, priority and intent identified" },
    { label: "Department", detail: "IT Support" },
    { label: "Workload check", detail: "Current load across the team" },
    { label: "Agent assigned", detail: "Simran", strong: true }
];

function AssignmentSection() {

    return (
        <SectionShell
            eyebrow="Automatic agent assignment"
            title="Routed to the right person, not just the next one."
            description="Nesti doesn't round-robin. It reads what the ticket needs, checks who's already carrying the most, and assigns the agent who can actually solve it."
            align="center"
            visualStyle={{ display: "flex", justifyContent: "center" }}
            visual={
                <div style={styles.flow}>
                    {NODES.map((n, i) => (
                        <div key={n.label} style={styles.item}>

                            {i > 0 && (
                                <ScrollReveal
                                    delay={0.12 * i}
                                    direction="scaleY"
                                    style={{ ...styles.connector, transformOrigin: "top" }}
                                />
                            )}

                            <ScrollReveal delay={0.12 * i + 0.08} distance={14}>
                                <div style={{ ...styles.node, ...(n.strong ? styles.nodeStrong : {}) }}>
                                    <span style={{ ...styles.nodeLabel, ...(n.strong ? { color: color.lavenderHighlight } : {}) }}>
                                        {n.label}
                                    </span>
                                    <span style={styles.nodeDetail}>{n.detail}</span>
                                </div>
                            </ScrollReveal>

                        </div>
                    ))}
                </div>
            }
        />
    );

}

const styles = {

    flow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "340px"
    },

    item: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },

    connector: {
        width: "1px",
        height: "26px",
        background: `linear-gradient(180deg, ${color.border}, ${color.borderStrong})`
    },

    node: {
        width: "100%",
        padding: "14px 18px",
        borderRadius: radius.md,
        background: color.card,
        border: `1px solid ${color.border}`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    nodeStrong: {
        background: color.lavenderBg,
        border: `1px solid ${color.lavenderBorder}`,
        boxShadow: "0 0 24px rgba(139,92,246,0.15)"
    },

    nodeLabel: {
        fontSize: "13.5px",
        fontWeight: 600,
        color: color.text
    },

    nodeDetail: {
        fontSize: "12px",
        color: color.textMuted
    }

};

export default AssignmentSection;

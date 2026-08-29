import { useState } from "react";
import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import AnimatedNumber from "./AnimatedNumber";
import { color, radius, shadow } from "../theme";

const METRICS = [
    { label: "Total tickets", value: 412, tone: color.text },
    { label: "Open", value: 58, tone: color.info },
    { label: "In progress", value: 91, tone: color.lavenderHighlight },
    { label: "Resolved", value: 263, tone: color.success },
    { label: "Emerging issues", value: 3, tone: color.champagne },
    { label: "Agents active", value: 14, tone: color.tealSoft }
];

function AdminIntelligenceSection() {

    const [visible, setVisible] = useState(false);

    return (
        <SectionShell
            eyebrow="Admin intelligence"
            title="Operations, at a glance."
            description="Admins don't get a spreadsheet. They get a live read on where the team stands right now, and which issues are about to need attention."
            visual={
                <ScrollReveal onVisible={() => setVisible(true)}>
                    <div style={styles.panel}>

                        <div style={styles.panelHeader}>
                            <span style={styles.panelTitle}>Support operations</span>
                            <span style={styles.panelCaption}>Illustrative preview data</span>
                        </div>

                        <div style={styles.grid} className="nesti-admin-grid">
                            {METRICS.map((m) => (
                                <div key={m.label} style={styles.tile}>
                                    <span style={{ ...styles.tileValue, color: m.tone }}>
                                        <AnimatedNumber value={visible ? m.value : 0} duration={900} />
                                    </span>
                                    <span style={styles.tileLabel}>{m.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </ScrollReveal>
            }
        />
    );

}

const styles = {

    panel: {
        borderRadius: radius.lg,
        background: color.card,
        border: `1px solid ${color.border}`,
        boxShadow: shadow.elevated,
        overflow: "hidden"
    },

    panelHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        borderBottom: `1px solid ${color.border}`
    },

    panelTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: color.text
    },

    panelCaption: {
        fontSize: "11.5px",
        color: color.textMuted
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)"
    },

    tile: {
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        borderRight: `1px solid ${color.border}`,
        borderBottom: `1px solid ${color.border}`
    },

    tileValue: {
        fontSize: "26px",
        fontWeight: 700,
        letterSpacing: "-0.5px"
    },

    tileLabel: {
        fontSize: "12.5px",
        color: color.textMuted
    }

};

export default AdminIntelligenceSection;

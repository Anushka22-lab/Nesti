import SectionShell from "./SectionShell";
import ScrollReveal from "./ScrollReveal";
import { color } from "../theme";

const STEPS = [
    { label: "Individual tickets", accent: color.textSecondary },
    { label: "AI understanding", accent: color.lavenderSoft },
    { label: "Recurring issue", accent: color.teal },
    { label: "Emerging issue", accent: color.champagne },
    { label: "Action", accent: color.success }
];

// A single horizontal chain — each node fades in after the line growing
// into it finishes, so the eye reads it left to right like a sentence.

function SignalFlowSection() {

    return (
        <SectionShell
            eyebrow="From noise to signal"
            title="Five tickets. One decision."
            description="Nesti doesn't stop at reading a ticket. It follows the thread from a single complaint to a decision your team can act on."
            visual={
                <div style={styles.flow} className="nesti-flow">
                    {STEPS.map((step, i) => (
                        <div key={step.label} style={styles.step}>

                            {i > 0 && (
                                <ScrollReveal
                                    delay={0.15 * i}
                                    direction="scaleX"
                                    style={{ ...styles.connector, transformOrigin: "left" }}
                                    className="nesti-flow-line"
                                />
                            )}

                            <ScrollReveal delay={0.15 * i + 0.1} direction="up" distance={12}>
                                <div style={styles.node}>
                                    <span style={{ ...styles.nodeDot, background: step.accent, boxShadow: `0 0 10px ${step.accent}` }} />
                                    <span style={styles.nodeLabel}>{step.label}</span>
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
        alignItems: "center",
        width: "100%"
    },

    step: {
        display: "flex",
        alignItems: "center",
        flex: "1 1 0"
    },

    connector: {
        height: "1px",
        flex: "1 1 40px",
        background: `linear-gradient(90deg, ${color.border}, ${color.borderStrong})`,
        marginRight: "-1px"
    },

    node: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "0 4px",
        textAlign: "center",
        minWidth: "108px"
    },

    nodeDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%"
    },

    nodeLabel: {
        fontSize: "12.5px",
        fontWeight: 600,
        color: color.text,
        letterSpacing: "0.1px"
    }

};

export default SignalFlowSection;

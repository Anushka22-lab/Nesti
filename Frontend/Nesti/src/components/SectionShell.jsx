import ScrollReveal from "./ScrollReveal";
import { color } from "../theme";

// Every new narrative section (02–10) shares this rhythm: a thin top
// divider, an eyebrow, a big statement, an optional supporting line, then
// whatever visual the section needs. Keeping it here means each section
// file only has to describe what's different about it.

function SectionShell({ eyebrow, title, description, align = "left", visual, style, visualStyle }) {

    const isCenter = align === "center";

    return (
        <div style={{ marginTop: "104px", paddingTop: "52px", borderTop: `1px solid ${color.elevated}`, ...style }}>

            <ScrollReveal>
                <div style={{
                    maxWidth: "620px",
                    margin: isCenter ? "0 auto" : "0",
                    textAlign: align
                }}>
                    {eyebrow && (
                        <div style={styles.eyebrow}>
                            <span style={styles.eyebrowDot} />
                            {eyebrow}
                        </div>
                    )}
                    {title && <h2 style={styles.title}>{title}</h2>}
                    {description && <p style={styles.description}>{description}</p>}
                </div>
            </ScrollReveal>

            {visual && (
                <div style={{ marginTop: "52px", ...visualStyle }}>
                    {visual}
                </div>
            )}

        </div>
    );

}

const styles = {

    eyebrow: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12.5px",
        fontWeight: 600,
        color: color.lavenderSoft,
        letterSpacing: "0.3px",
        marginBottom: "18px"
    },

    eyebrowDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: color.teal,
        boxShadow: `0 0 8px ${color.teal}`,
        flexShrink: 0
    },

    title: {
        margin: "0 0 14px",
        fontSize: "32px",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.8px",
        color: color.text
    },

    description: {
        margin: 0,
        fontSize: "15.5px",
        lineHeight: 1.7,
        color: color.textSecondary
    }

};

export default SectionShell;

import { color, radius, shadow } from "../theme";

// Card — the base surface every panel/metric/table sits on.
export function Card({ children, style, hover = true, className = "" }) {
    return (
        <div
            className={`${hover ? "nesti-card-hover" : ""} ${className}`}
            style={{
                background: color.card,
                border: `1px solid ${color.border}`,
                borderRadius: radius.md,
                boxShadow: shadow.card,
                ...style
            }}
        >
            {children}
        </div>
    );
}

// Button — primary (lavender) / ghost (subtle) variants.
export function Button({ children, variant = "primary", style, ...props }) {

    const variants = {
        primary: {
            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            color: "#fff",
            border: "1px solid rgba(139,92,246,0.4)"
        },
        ghost: {
            background: color.elevated,
            color: color.text,
            border: `1px solid ${color.border}`
        },
        outline: {
            background: "transparent",
            color: color.lavenderHighlight,
            border: `1px solid ${color.lavenderBorder}`
        }
    };

    return (
        <button
            className="nesti-btn"
            style={{
                padding: "10px 18px",
                borderRadius: radius.sm,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                ...variants[variant],
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
}

export default { Card, Button };

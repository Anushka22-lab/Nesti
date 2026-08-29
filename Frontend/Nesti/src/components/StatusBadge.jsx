import { statusStyle } from "../theme";

function StatusBadge({ status, label }) {

    const s = statusStyle(status);

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2px",
                color: s.color,
                background: s.background,
                border: `1px solid ${s.border}`,
                textTransform: "capitalize"
            }}
        >
            {label || status}
        </span>
    );

}

export default StatusBadge;

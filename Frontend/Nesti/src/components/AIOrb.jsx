// Abstract intelligence indicator — orbital rings, not a mascot.
// size in px.
function AIOrb({ size = 40, active = true }) {

    return (
        <div
            style={{
                position: "relative",
                width: size,
                height: size,
                flexShrink: 0
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 35% 30%, #C4B5FD, #8B5CF6 55%, #5B3FA8 100%)",
                    boxShadow: "0 0 16px rgba(139,92,246,0.55)",
                    animation: active
                        ? "nesti-pulse 2.6s ease-in-out infinite"
                        : "none"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: "50%",
                    border: "1px solid rgba(139,92,246,0.35)",
                    animation: active
                        ? "nesti-spin 6s linear infinite"
                        : "none"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: "50%",
                    border: "1px solid rgba(45,212,191,0.2)",
                    animation: active
                        ? "nesti-spin 11s linear infinite reverse"
                        : "none"
                }}
            />
        </div>
    );

}

export default AIOrb;

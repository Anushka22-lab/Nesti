// The one memorable visual on the landing page: scattered support
// tickets drift in, get read by Nesti, and draw together into a
// single detected pattern. This is what the product actually does —
// not a decorative orb.
function SignalGraphic() {

    const nodes = [
        { x: 40, y: 46 },
        { x: 78, y: 24 },
        { x: 300, y: 30 },
        { x: 338, y: 58 },
        { x: 30, y: 210 },
        { x: 66, y: 240 },
        { x: 312, y: 220 },
        { x: 344, y: 190 }
    ];

    const cx = 189, cy = 132;

    return (
        <svg
            viewBox="0 0 380 264"
            style={{ width: "100%", height: "auto", overflow: "visible" }}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="55%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#5B3FA8" />
                </radialGradient>
            </defs>

            {/* connecting lines — draw in, hold, fade, loop */}
            {nodes.map((n, i) => (
                <line
                    key={`line-${i}`}
                    x1={n.x}
                    y1={n.y}
                    x2={cx}
                    y2={cy}
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="240"
                    style={{
                        animation: `nesti-draw 5.5s ease-in-out ${i * 0.35}s infinite`
                    }}
                />
            ))}

            {/* ticket nodes */}
            {nodes.map((n, i) => (
                <g key={`node-${i}`} style={{ animation: `nesti-float ${4 + (i % 3)}s ease-in-out ${i * 0.2}s infinite` }}>
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r="3.5"
                        fill={i % 3 === 0 ? "#2DD4BF" : i % 3 === 1 ? "#8B5CF6" : "#D6B98C"}
                    />
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r="3"
                        fill="none"
                        stroke={i % 3 === 0 ? "#2DD4BF" : i % 3 === 1 ? "#8B5CF6" : "#D6B98C"}
                        style={{ animation: `nesti-node-ping 5.5s ease-out ${i * 0.35}s infinite` }}
                    />
                </g>
            ))}

            {/* central detected-pattern core */}
            <g style={{ animation: "nesti-core-pulse 2.8s ease-in-out infinite", transformOrigin: `${cx}px ${cy}px` }}>
                <circle cx={cx} cy={cy} r="30" fill="rgba(139,92,246,0.12)" />
                <circle cx={cx} cy={cy} r="18" fill="url(#coreGlow)" />
            </g>

            <circle
                cx={cx}
                cy={cy}
                r="42"
                fill="none"
                stroke="rgba(139,92,246,0.25)"
                strokeWidth="1"
            />
        </svg>
    );

}

export default SignalGraphic;

// ============================================================
// NESTI DESIGN SYSTEM — SHARED TOKENS
// Quiet luxury + AI intelligence + enterprise trust.
// Import this anywhere instead of hardcoding colors.
// ============================================================

export const color = {
    // Surfaces
    obsidian: "#080B12",
    navy: "#0B1020",
    surface: "#0E1420",
    card: "#111824",
    elevated: "#151C29",
    border: "#202938",
    borderStrong: "#2A3547",

    // Brand — lavender
    lavender: "#8B5CF6",
    lavenderSoft: "#A78BFA",
    lavenderHighlight: "#C4B5FD",
    lavenderBg: "rgba(139,92,246,0.12)",
    lavenderBorder: "rgba(139,92,246,0.25)",

    // Intelligence — teal
    teal: "#2DD4BF",
    tealSoft: "#5EEAD4",
    tealBg: "rgba(45,212,191,0.12)",
    tealBorder: "rgba(45,212,191,0.25)",

    // Premium — champagne
    champagne: "#D6B98C",
    champagneSoft: "#E7D7BA",
    champagneBg: "rgba(214,185,140,0.12)",

    // Status
    success: "#34D399",
    successBg: "rgba(52,211,153,0.12)",
    warning: "#FBBF24",
    warningBg: "rgba(251,191,36,0.12)",
    danger: "#FB7185",
    dangerBg: "rgba(251,113,133,0.12)",
    info: "#60A5FA",
    infoBg: "rgba(96,165,250,0.12)",

    // Text
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
};

export const radius = {
    sm: "8px",
    md: "12px",
    lg: "16px",
    pill: "999px",
};

export const shadow = {
    card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)",
    elevated: "0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px rgba(0,0,0,0.45)",
    glowLavender: "0 0 0 1px rgba(139,92,246,0.25), 0 8px 30px rgba(139,92,246,0.15)",
    glowTeal: "0 0 0 1px rgba(45,212,191,0.25), 0 8px 30px rgba(45,212,191,0.12)",
};

export const font = {
    family:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const statusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("open"))
        return { color: color.info, background: color.infoBg, border: "rgba(96,165,250,0.25)" };
    if (s.includes("progress"))
        return { color: color.lavenderHighlight, background: color.lavenderBg, border: color.lavenderBorder };
    if (s.includes("resolved"))
        return { color: color.success, background: color.successBg, border: "rgba(52,211,153,0.25)" };
    if (s.includes("closed"))
        return { color: color.textMuted, background: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.25)" };
    if (s.includes("urgent") || s.includes("high") || s.includes("critical"))
        return { color: color.danger, background: color.dangerBg, border: "rgba(251,113,133,0.25)" };
    if (s.includes("medium") || s.includes("warn"))
        return { color: color.warning, background: color.warningBg, border: "rgba(251,191,36,0.25)" };
    return { color: color.textSecondary, background: "rgba(148,163,184,0.1)", border: color.border };
};

export default { color, radius, shadow, font, statusStyle };
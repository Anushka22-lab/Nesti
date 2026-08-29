import { useState } from "react";
import api from "./services/api";
import GalaxyBackground from "./components/GalaxyBackground";
import AIOrb from "./components/AIOrb";


function Login({
    role,
    onLogin,
    onRegister,
    onBack
}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ========================================
    // ROLE NAME
    // ========================================

    const roleName =
        role
            ? role.charAt(0).toUpperCase() +
              role.slice(1)
            : "User";


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email:
                            email
                                .trim()
                                .toLowerCase(),

                        password
                    }
                );


            console.log(
                "Login response:",
                response.data
            );


            const loggedInUser =
                response.data.user;


            if (!loggedInUser) {

                throw new Error(
                    "User information missing from login response"
                );

            }


            // ========================================
            // CHECK SELECTED ROLE
            // ========================================

            if (
                loggedInUser.role !== role
            ) {

                throw new Error(
                    `This account is not registered as a ${roleName}.`
                );

            }


            // ========================================
            // LOGIN SUCCESS
            // ========================================

            onLogin(loggedInUser);


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div style={styles.page}>

            <GalaxyBackground />

            <form
                onSubmit={handleLogin}
                style={styles.card}
                className="nesti-fade-up"
            >

                {/* LOGO */}

                <div style={styles.brandRow}>
                    <AIOrb size={26} />
                    <span style={styles.logo}>Nesti</span>
                </div>

                <p style={styles.subtitle}>
                    {roleName} login
                </p>


                {/* EMAIL */}

                <label style={styles.label}>
                    Email
                </label>

                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={styles.input}
                    autoComplete="email"
                    disabled={loading}
                    required
                />


                {/* PASSWORD */}

                <label style={styles.label}>
                    Password
                </label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={styles.input}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                />


                {/* ERROR */}

                {error && (

                    <div style={styles.error} className="nesti-fade-in">
                        {error}
                    </div>

                )}


                {/* LOGIN BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.button,

                        ...(loading
                            ? styles.disabledButton
                            : {})
                    }}
                    className="nesti-btn"
                >

                    {loading
                        ? "Logging in…"
                        : `Login as ${roleName}`}

                </button>


                {/* REGISTER */}

                <div style={styles.registerSection}>

                    <span style={styles.registerText}>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onRegister}
                        disabled={loading}
                        style={styles.registerButton}
                    >
                        Register
                    </button>

                </div>


                {/* BACK */}

                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    style={styles.backButton}
                >
                    ← Back to role selection
                </button>

            </form>

        </div>

    );

}


// ========================================
// STYLES
// ========================================

const styles = {

    page: {

        position: "relative",

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",

        boxSizing: "border-box",

        background: "#080B12",

        color: "#F8FAFC",

        fontFamily: "'Inter', -apple-system, sans-serif"

    },


    card: {

        position: "relative",

        zIndex: 1,

        width: "100%",

        maxWidth: "420px",

        padding: "40px",

        boxSizing: "border-box",

        background: "#111824",

        border: "1px solid #202938",

        borderRadius: "16px",

        boxShadow:
            "0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 50px rgba(0,0,0,0.5)"

    },

    brandRow: {

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "9px"

    },

    logo: {

        fontSize: "20px",

        fontWeight: "700",

        letterSpacing: "-0.4px",

        color: "#F8FAFC"

    },


    subtitle: {

        marginTop: "10px",

        marginBottom: "30px",

        textAlign: "center",

        color: "#94A3B8",

        fontSize: "14px"

    },


    label: {

        display: "block",

        marginBottom: "8px",

        fontSize: "13px",

        fontWeight: "600",

        color: "#94A3B8"

    },


    input: {

        width: "100%",

        padding: "12px 14px",

        marginBottom: "18px",

        boxSizing: "border-box",

        border: "1px solid #202938",

        borderRadius: "9px",

        background: "#0E1420",

        color: "#F8FAFC",

        fontSize: "14px",

        outline: "none"

    },


    button: {

        width: "100%",

        padding: "12px",

        border: "1px solid rgba(139,92,246,0.4)",

        borderRadius: "9px",

        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",

        color: "white",

        fontSize: "14px",

        fontWeight: "600",

        cursor: "pointer"

    },


    disabledButton: {

        opacity: 0.6,

        cursor: "not-allowed"

    },


    error: {

        marginBottom: "15px",

        padding: "11px 13px",

        borderRadius: "8px",

        background: "rgba(251,113,133,0.12)",

        border: "1px solid rgba(251,113,133,0.25)",

        color: "#FB7185",

        fontSize: "13px",

        textAlign: "center"

    },


    registerSection: {

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        gap: "5px",

        marginTop: "24px",

        fontSize: "14px"

    },


    registerText: {

        color: "#94A3B8"

    },


    registerButton: {

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#C4B5FD",

        fontSize: "14px",

        fontWeight: "600",

        cursor: "pointer"

    },


    backButton: {

        display: "block",

        margin: "22px auto 0",

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#64748B",

        fontSize: "13px",

        cursor: "pointer"

    }

};


export default Login;

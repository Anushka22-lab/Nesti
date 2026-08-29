import { useState } from "react";
import api from "./services/api";
import GalaxyBackground from "./components/GalaxyBackground";
import AIOrb from "./components/AIOrb";


function Register({
    role,
    onRegisterSuccess,
    onGoToLogin,
    onBack
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
    // REGISTER
    // ========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ========================================
        // VALIDATION
        // ========================================

        if (!name.trim()) {

            setError(
                "Please enter your name."
            );

            return;

        }


        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;

        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        try {

            setLoading(true);


            // ========================================
            // REGISTER
            // ========================================

            const response =
                await api.post(
                    "/auth/register",
                    {
                        name:
                            name.trim(),

                        email:
                            email
                                .trim()
                                .toLowerCase(),

                        password,

                        role
                    }
                );


            console.log(
                "REGISTER RESPONSE:",
                response.data
            );


            setSuccess(
                `${roleName} account created successfully.`
            );


            // Clear form

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");


            // ========================================
            // GO TO LOGIN
            // ========================================

            setTimeout(() => {

                if (onRegisterSuccess) {

                    onRegisterSuccess();

                }

            }, 1000);


        } catch (err) {

            console.error(
                "REGISTER ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                onSubmit={handleRegister}
                style={styles.card}
                className="nesti-fade-up"
            >

                {/* LOGO */}

                <div style={styles.brandRow}>
                    <AIOrb size={26} />
                    <span style={styles.logo}>Nesti</span>
                </div>

                <p style={styles.subtitle}>
                    Create {roleName} account
                </p>


                {/* ERROR */}

                {error && (

                    <div style={styles.error} className="nesti-fade-in">
                        {error}
                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div style={styles.success} className="nesti-fade-in">
                        {success}
                    </div>

                )}


                {/* NAME */}

                <label style={styles.label}>
                    Full Name
                </label>

                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    style={styles.input}
                    disabled={loading}
                    autoComplete="name"
                    required
                />


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
                    disabled={loading}
                    autoComplete="email"
                    required
                />


                {/* PASSWORD */}

                <label style={styles.label}>
                    Password
                </label>

                <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={styles.input}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                />


                {/* CONFIRM PASSWORD */}

                <label style={styles.label}>
                    Confirm Password
                </label>

                <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    style={styles.input}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                />


                {/* CREATE ACCOUNT */}

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
                        ? "Creating account…"
                        : `Create ${roleName} account`}

                </button>


                {/* LOGIN */}

                <div style={styles.loginSection}>

                    <span style={styles.loginText}>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onGoToLogin}
                        disabled={loading}
                        style={styles.loginButton}
                    >
                        Login
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

        padding: "30px 20px",

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

        padding: "36px",

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

        margin: "10px 0 26px",

        textAlign: "center",

        color: "#94A3B8",

        fontSize: "14px"

    },


    label: {

        display: "block",

        marginTop: "14px",

        marginBottom: "7px",

        fontSize: "13px",

        fontWeight: "600",

        color: "#94A3B8"

    },


    input: {

        width: "100%",

        padding: "12px 14px",

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

        marginTop: "22px",

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

        padding: "11px 13px",

        marginBottom: "14px",

        borderRadius: "8px",

        background: "rgba(251,113,133,0.12)",

        border: "1px solid rgba(251,113,133,0.25)",

        color: "#FB7185",

        fontSize: "13px"

    },


    success: {

        padding: "11px 13px",

        marginBottom: "14px",

        borderRadius: "8px",

        background: "rgba(52,211,153,0.12)",

        border: "1px solid rgba(52,211,153,0.25)",

        color: "#34D399",

        fontSize: "13px"

    },


    loginSection: {

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        gap: "5px",

        marginTop: "22px",

        fontSize: "14px"

    },


    loginText: {

        color: "#94A3B8"

    },


    loginButton: {

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#C4B5FD",

        fontWeight: "600",

        cursor: "pointer",

        fontSize: "14px"

    },


    backButton: {

        display: "block",

        margin: "20px auto 0",

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#64748B",

        fontSize: "13px",

        cursor: "pointer"

    }

};


export default Register;

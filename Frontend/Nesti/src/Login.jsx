import { useState } from "react";
import api from "./services/api";


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

            <form
                onSubmit={handleLogin}
                style={styles.card}
            >

                {/* LOGO */}

                <h1 style={styles.logo}>
                    Nesti
                </h1>

                <p style={styles.subtitle}>
                    {roleName} Login
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

                    <div style={styles.error}>
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
                >

                    {loading
                        ? "Logging in..."
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

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",

        boxSizing: "border-box",

        background: "#f5f7fb",

        color: "#1f2937"

    },


    card: {

        width: "100%",

        maxWidth: "440px",

        padding: "42px",

        boxSizing: "border-box",

        background: "white",

        borderRadius: "18px",

        boxShadow:
            "0 15px 45px rgba(0,0,0,0.08)"

    },


    logo: {

        margin: 0,

        textAlign: "center",

        fontSize: "32px",

        fontWeight: "800",

        letterSpacing: "-1px"

    },


    subtitle: {

        marginTop: "8px",

        marginBottom: "35px",

        textAlign: "center",

        color: "#6b7280",

        fontSize: "15px"

    },


    label: {

        display: "block",

        marginBottom: "8px",

        fontSize: "14px",

        fontWeight: "600"

    },


    input: {

        width: "100%",

        padding: "13px 14px",

        marginBottom: "20px",

        boxSizing: "border-box",

        border: "1px solid #d1d5db",

        borderRadius: "9px",

        fontSize: "15px",

        outline: "none"

    },


    button: {

        width: "100%",

        padding: "13px",

        border: "none",

        borderRadius: "9px",

        background: "#111827",

        color: "white",

        fontSize: "15px",

        fontWeight: "700",

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

        background: "#fee2e2",

        color: "#991b1b",

        fontSize: "14px",

        textAlign: "center"

    },


    registerSection: {

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        gap: "5px",

        marginTop: "25px",

        fontSize: "14px"

    },


    registerText: {

        color: "#6b7280"

    },


    registerButton: {

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#4f46e5",

        fontSize: "14px",

        fontWeight: "700",

        cursor: "pointer"

    },


    backButton: {

        display: "block",

        margin: "22px auto 0",

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#6b7280",

        fontSize: "13px",

        cursor: "pointer"

    }

};


export default Login;
import { useState } from "react";
import api from "./services/api";


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
                `${roleName} account created successfully! 🎉`
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

            <form
                onSubmit={handleRegister}
                style={styles.card}
            >

                {/* LOGO */}

                <h1 style={styles.logo}>
                    Nesti
                </h1>

                <p style={styles.subtitle}>
                    Create {roleName} Account
                </p>


                {/* ERROR */}

                {error && (

                    <div style={styles.error}>
                        {error}
                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div style={styles.success}>
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
                >

                    {loading
                        ? "Creating Account..."
                        : `Create ${roleName} Account`}

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

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "30px 20px",

        boxSizing: "border-box",

        background: "#f5f7fb",

        color: "#111827"

    },


    card: {

        width: "100%",

        maxWidth: "420px",

        padding: "38px",

        boxSizing: "border-box",

        background: "white",

        borderRadius: "18px",

        boxShadow:
            "0 12px 40px rgba(0,0,0,0.08)"

    },


    logo: {

        margin: 0,

        textAlign: "center",

        fontSize: "32px",

        fontWeight: "800",

        letterSpacing: "-1px"

    },


    subtitle: {

        margin: "8px 0 28px",

        textAlign: "center",

        color: "#6b7280",

        fontSize: "15px"

    },


    label: {

        display: "block",

        marginTop: "15px",

        marginBottom: "7px",

        fontSize: "14px",

        fontWeight: "600",

        color: "#374151"

    },


    input: {

        width: "100%",

        padding: "13px 14px",

        boxSizing: "border-box",

        border: "1px solid #d1d5db",

        borderRadius: "9px",

        fontSize: "14px",

        outline: "none"

    },


    button: {

        width: "100%",

        marginTop: "24px",

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

        padding: "12px 14px",

        marginBottom: "15px",

        borderRadius: "9px",

        background: "#fee2e2",

        color: "#991b1b",

        fontSize: "14px"

    },


    success: {

        padding: "12px 14px",

        marginBottom: "15px",

        borderRadius: "9px",

        background: "#dcfce7",

        color: "#166534",

        fontSize: "14px"

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

        color: "#6b7280"

    },


    loginButton: {

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#4f46e5",

        fontWeight: "700",

        cursor: "pointer",

        fontSize: "14px"

    },


    backButton: {

        display: "block",

        margin: "20px auto 0",

        padding: 0,

        border: "none",

        background: "transparent",

        color: "#6b7280",

        fontSize: "13px",

        cursor: "pointer"

    }

};


export default Register;
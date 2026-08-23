import { useState } from "react";
import api from "./services/api";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("Login response:", response.data);

            // Get logged-in user
            const me = await api.get("/auth/me");

            onLogin(me.data.user);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div style={styles.page}>

            <form
                onSubmit={handleLogin}
                style={styles.card}
            >

                <h1 style={styles.logo}>
                    Nesti
                </h1>

                <p style={styles.subtitle}>
                    AI-powered customer support
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={styles.input}
                    required
                />

                <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

            </form>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb"
    },

    card: {
        width: "360px",
        padding: "40px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
    },

    logo: {
        textAlign: "center",
        marginBottom: "5px"
    },

    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: "30px"
    },

    input: {
        width: "100%",
        padding: "13px",
        marginBottom: "15px",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px"
    },

    button: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        background: "#111827",
        color: "white",
        fontSize: "15px",
        cursor: "pointer"
    },

    error: {
        color: "#dc2626",
        textAlign: "center",
        marginTop: "15px"
    }

};

export default Login;
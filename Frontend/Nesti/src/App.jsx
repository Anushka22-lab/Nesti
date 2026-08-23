import { useEffect, useState } from "react";

import api from "./services/api";

import Login from "./Login";
import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./AdminDashboard";


function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // ========================================
    // CHECK LOGIN
    // ========================================

    useEffect(() => {

        const checkLogin = async () => {

            try {

                const response =
                    await api.get("/auth/me");

                console.log(
                    "Current user:",
                    response.data.user
                );

                setUser(response.data.user);

            } catch (error) {

                console.log("No active login");

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        checkLogin();

    }, []);


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = (loggedInUser) => {

        console.log(
            "Logged in user:",
            loggedInUser
        );

        setUser(loggedInUser);

    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = async () => {

        try {

            const response =
                await api.post("/auth/logout");

            console.log(
                response.data
            );

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Logout request failed"
            );

        } finally {

            setUser(null);

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <h2>
                        Loading Nesti...
                    </h2>

                    <p>
                        Checking your account
                    </p>

                </div>

            </div>
        );

    }


    // ========================================
    // NOT LOGGED IN
    // ========================================

    if (!user) {

        return (
            <Login
                onLogin={handleLogin}
            />
        );

    }


    // ========================================
    // AGENT
    // ========================================

    if (user.role === "agent") {

        return (
            <AgentDashboard
                user={user}
                onLogout={handleLogout}
            />
        );

    }


    // ========================================
    // CUSTOMER
    // ========================================

    if (user.role === "customer") {

        return (
            <CustomerDashboard
                user={user}
                onLogout={handleLogout}
            />
        );

    }


    // ========================================
    // ADMIN
    // ========================================

    if (user.role === "admin") {

        return (
            <AdminDashboard
                user={user}
                onLogout={handleLogout}
            />
        );

    }


    // ========================================
    // UNKNOWN ROLE
    // ========================================

    return (
        <div style={styles.center}>

            <div style={styles.loadingCard}>

                <h2>
                    Unknown User Role
                </h2>

                <p>
                    Role: {user.role}
                </p>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>

            </div>

        </div>
    );

}


const styles = {

    center: {

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background: "#f5f7fb",

        color: "#1f2937"

    },

    loadingCard: {

        background: "white",

        padding: "40px",

        borderRadius: "14px",

        textAlign: "center",

        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)"

    },

    logoutButton: {

        marginTop: "15px",

        padding: "10px 20px",

        border: "none",

        borderRadius: "8px",

        background: "#111827",

        color: "white",

        cursor: "pointer",

        fontWeight: "600"

    }

};


export default App;
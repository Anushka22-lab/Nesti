import { useEffect, useState } from "react";

import api from "./services/api";

import Login from "./Login";
import Register from "./Register";

import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./AdminDashboard";


function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // "login" or "register"
    const [authScreen, setAuthScreen] =
        useState("login");


    // ========================================
    // CHECK EXISTING LOGIN
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

                setUser(
                    response.data.user
                );

            } catch (error) {

                console.log(
                    "No active login"
                );

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        checkLogin();

    }, []);


    // ========================================
    // LOGIN SUCCESS
    // ========================================

    const handleLogin = (loggedInUser) => {

        console.log(
            "Logged in user:",
            loggedInUser
        );

        setUser(loggedInUser);

    };


    // ========================================
    // REGISTRATION SUCCESS
    // ========================================
    // Register.jsx should call this after
    // successful customer registration.
    //
    // We intentionally DO NOT automatically
    // log the customer in here.
    //
    // User is sent back to Login screen.

    const handleRegisterSuccess = () => {

        setAuthScreen("login");

    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = async () => {

        try {

            const response =
                await api.post(
                    "/auth/logout"
                );

            console.log(
                "Logout response:",
                response.data
            );

        } catch (error) {

            console.log(
                "Logout request failed:",
                error.response?.data?.message ||
                error.message
            );

        } finally {

            setUser(null);

            // Always return to login screen
            setAuthScreen("login");

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div style={styles.center}>

                <div style={styles.loadingCard}>

                    <div style={styles.logo}>
                        Nesti
                    </div>

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

        // -------------------------------
        // LOGIN
        // -------------------------------

        if (authScreen === "login") {

            return (

                <Login
                    onLogin={handleLogin}
                    onRegister={() =>
                        setAuthScreen("register")
                    }
                />

            );

        }


        // -------------------------------
        // REGISTER
        // -------------------------------

        return (

            <Register
                onRegisterSuccess={
                    handleRegisterSuccess
                }
                onLogin={() =>
                    setAuthScreen("login")
                }
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

                <div style={styles.logo}>
                    Nesti
                </div>

                <h2>
                    Unknown User Role
                </h2>

                <p>
                    Role: {user.role || "Unknown"}
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


// ========================================
// STYLES
// ========================================

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

        width: "360px",

        padding: "40px",

        background: "white",

        borderRadius: "16px",

        textAlign: "center",

        boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)"

    },


    logo: {

        fontSize: "32px",

        fontWeight: "800",

        marginBottom: "10px"

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
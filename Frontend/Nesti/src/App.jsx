import { useEffect, useState } from "react";

import api from "./services/api";

import RoleSelection from "./RoleSelection";
import Login from "./Login";
import Register from "./Register";

import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./AdminDashboard";

import GalaxyBackground from "./components/GalaxyBackground";
import AIOrb from "./components/AIOrb";


function App() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);


    // ========================================
    // AUTH SCREEN
    // ========================================
    //
    // role     = first screen
    // login    = login page
    // register = registration page
    //

    const [authScreen, setAuthScreen] =
        useState("role");


    // ========================================
    // SELECTED ROLE
    // ========================================

    const [selectedRole, setSelectedRole] =
        useState(null);


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
    // SELECT ROLE
    // ========================================

    const handleSelectRole = (role) => {

        console.log(
            "Selected role:",
            role
        );

        setSelectedRole(role);

        setAuthScreen("login");

    };


    // ========================================
    // GO TO REGISTER
    // ========================================

    const handleGoToRegister = () => {

        setAuthScreen("register");

    };


    // ========================================
    // GO TO LOGIN
    // ========================================

    const handleGoToLogin = () => {

        setAuthScreen("login");

    };


    // ========================================
    // BACK TO ROLE SELECTION
    // ========================================

    const handleBackToRoles = () => {

        setSelectedRole(null);

        setAuthScreen("role");

    };


    // ========================================
    // REGISTRATION SUCCESS
    // ========================================

    const handleRegisterSuccess = () => {

        setAuthScreen("login");

    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = async () => {

        try {

            await api.post(
                "/auth/logout"
            );

        } catch (error) {

            console.log(
                "Logout request failed:",
                error.response?.data?.message ||
                error.message
            );

        } finally {

            setUser(null);

            setSelectedRole(null);

            setAuthScreen("role");

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div style={styles.center}>

                <GalaxyBackground />

                <div style={styles.loadingCard} className="nesti-fade-up">

                    <AIOrb size={44} />

                    <h2 style={styles.loadingTitle}>
                        Loading Nesti
                    </h2>

                    <p style={styles.loadingText}>
                        Checking your account…
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // LOGGED-IN USER
    // ========================================

    if (user) {

        // CUSTOMER

        if (
            user.role === "customer"
        ) {

            return (

                <CustomerDashboard
                    user={user}
                    onLogout={handleLogout}
                />

            );

        }


        // AGENT

        if (
            user.role === "agent"
        ) {

            return (

                <AgentDashboard
                    user={user}
                    onLogout={handleLogout}
                />

            );

        }


        // ADMIN

        if (
            user.role === "admin"
        ) {

            return (

                <AdminDashboard
                    user={user}
                    onLogout={handleLogout}
                />

            );

        }


        // UNKNOWN ROLE

        return (

            <div style={styles.center}>

                <GalaxyBackground />

                <div style={styles.loadingCard}>

                    <h2 style={styles.loadingTitle}>
                        Unknown user role
                    </h2>

                    <p style={styles.loadingText}>
                        Role: {user.role || "Unknown"}
                    </p>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                        className="nesti-btn"
                    >
                        Logout
                    </button>

                </div>

            </div>

        );

    }


    // ========================================
    // ROLE SELECTION SCREEN
    // ========================================

    if (
        authScreen === "role"
    ) {

        return (

            <RoleSelection

                onCustomer={() =>
                    handleSelectRole(
                        "customer"
                    )
                }

                onAgent={() =>
                    handleSelectRole(
                        "agent"
                    )
                }

                onAdmin={() =>
                    handleSelectRole(
                        "admin"
                    )
                }

            />

        );

    }


    // ========================================
    // LOGIN SCREEN
    // ========================================

    if (
        authScreen === "login"
    ) {

        return (

            <Login

                role={selectedRole}

                onLogin={handleLogin}

                onRegister={
                    handleGoToRegister
                }

                onBack={
                    handleBackToRoles
                }

            />

        );

    }


    // ========================================
    // REGISTER SCREEN
    // ========================================

    if (
        authScreen === "register"
    ) {

        return (

            <Register

                role={selectedRole}

                onRegisterSuccess={
                    handleRegisterSuccess
                }

                onGoToLogin={
                    handleGoToLogin
                }

                onBack={
                    handleBackToRoles
                }

            />

        );

    }


    return null;

}


// ========================================
// STYLES
// ========================================

const styles = {

    center: {

        position: "relative",

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background: "#080B12",

        color: "#F8FAFC",

        fontFamily: "'Inter', -apple-system, sans-serif"

    },


    loadingCard: {

        position: "relative",

        zIndex: 1,

        width: "340px",

        padding: "40px",

        boxSizing: "border-box",

        background: "#111824",

        border: "1px solid #202938",

        borderRadius: "16px",

        textAlign: "center",

        boxShadow:
            "0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 50px rgba(0,0,0,0.5)",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        gap: "14px"

    },

    loadingTitle: {

        margin: 0,

        fontSize: "17px",

        fontWeight: "600",

        color: "#F8FAFC"

    },

    loadingText: {

        margin: 0,

        fontSize: "13px",

        color: "#94A3B8"

    },


    logoutButton: {

        marginTop: "6px",

        padding: "10px 20px",

        border: "1px solid rgba(139,92,246,0.4)",

        borderRadius: "8px",

        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",

        color: "white",

        cursor: "pointer",

        fontWeight: "600",

        fontSize: "13px"

    }

};


export default App;

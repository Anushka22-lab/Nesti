import { useEffect, useState } from "react";

import api from "./services/api";

import RoleSelection from "./RoleSelection";
import Login from "./Login";
import Register from "./Register";

import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./AdminDashboard";


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

                <div style={styles.loadingCard}>

                    <h2>
                        Unknown User Role
                    </h2>

                    <p>
                        Role:{" "}
                        {user.role || "Unknown"}
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

        boxSizing: "border-box",

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
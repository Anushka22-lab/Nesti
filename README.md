# Nesti --- AI-Powered Support Intelligence

> **Where every complaint gets its nest.**

Nesti is a full-stack AI-powered customer support intelligence platform
designed to turn scattered customer complaints into organized,
actionable signals.

Instead of treating every support ticket as an isolated conversation,
Nesti uses AI to understand tickets, classify them, detect recurring
problems, recommend practical next steps, automatically route tickets to
the right support team, and surface emerging issues before they become
larger incidents.

------------------------------------------------------------------------

## ✦ Why Nesti?

Traditional support systems are good at storing tickets.

The problem is that the **bigger picture is often hidden inside those
tickets**.

Ten customers may describe the same login problem in ten different ways.
A support team may solve each ticket individually without realizing that
the same underlying issue is affecting many customers.

Nesti connects those dots.

### The idea

**Scattered complaints → AI understanding → Related issues → Clear
signals → Faster action**

And the name reflects the product philosophy:

> **Every complaint gets its nest.**

Every incoming complaint gets a place to land, gets organized with
related complaints, and becomes part of a larger picture that support
teams can actually act on.

------------------------------------------------------------------------

# 🚀 Core Features

## 1. AI-Powered Ticket Analysis

Every newly created ticket is analyzed using Google's Gemini API.

Nesti extracts:

-   Category
-   Priority
-   Customer intent
-   Issue summary
-   Suggested support department
-   Normalized recurring issue key
-   Human-readable issue title
-   Recommended solution
-   Recommended immediate action
-   Solution confidence

Example:

``` text
Customer:
"I haven't been able to sign in since yesterday."

AI:
Category: account
Priority: high
Department: IT Support
Issue: Account Login Failure
```

------------------------------------------------------------------------

## 2. Recurring Issue Detection

Nesti does not create a separate problem for every ticket.

Instead, AI generates a normalized `issueKey` so tickets describing the
same underlying problem can be grouped together.

For example:

``` text
"I cannot login"

"Unable to sign in"

"Login stopped working"

        ↓

account_login_failure
```

This creates a persistent view of the problems customers are actually
experiencing.

------------------------------------------------------------------------

## 3. Emerging Issue Detection 🚨

Nesti compares ticket activity across two time windows:

-   Current 24 hours
-   Previous 24 hours

It identifies issues whose ticket volume has suddenly increased.

Current implementation considers an issue emerging when:

-   At least 3 tickets appear in the current period, and
-   There were no previous tickets, or
-   Ticket volume increased by at least 50%

The system also derives a severity level:

``` text
Medium
High
Critical
```

This allows administrators to spot customer-impacting problems early.

------------------------------------------------------------------------

## 4. AI Recommended Solutions ⭐

Nesti goes beyond classification.

For every ticket, Gemini can recommend:

### Recommended Solution

A concise troubleshooting or investigation approach.

### Recommended Action

The immediate step an agent should take.

### Solution Confidence

``` text
low
medium
high
```

The AI is instructed not to invent company policies, refund rules, or
unavailable capabilities.

If the ticket does not contain enough information, it explicitly
recommends additional investigation.

------------------------------------------------------------------------

## 5. Intelligent Ticket Assignment

Tickets can be automatically routed based on the AI-detected department.

Supported departments:

``` text
IT Support
Billing Support
Account Support
General Support
```

Nesti finds an appropriate agent and assigns the ticket automatically
when possible.

Admins can also manually reassign tickets.

------------------------------------------------------------------------

## 6. Role-Based Platform

Nesti supports three primary roles:

### Customer

Customers can:

-   Create support tickets
-   View their tickets
-   Open ticket details
-   Communicate through comments/replies
-   Track ticket progress

### Agent

Agents can:

-   View assigned tickets
-   Work on customer issues
-   Use AI-generated recommendations
-   Communicate with customers
-   Update ticket progress

### Admin

Admins can:

-   View all tickets
-   Monitor ticket analytics
-   View agent workload
-   Assign tickets
-   Update ticket status
-   Monitor recurring issues
-   Monitor emerging issues
-   Inspect AI-generated intelligence

------------------------------------------------------------------------

# ⚡ Real-Time Support

Nesti uses Socket.IO for real-time updates.

Real-time events currently include:

-   Ticket creation
-   Ticket assignment updates
-   Ticket status updates
-   Ticket comments/replies

This means users do not have to constantly refresh the dashboard to see
changes.

------------------------------------------------------------------------

# 📊 Admin Intelligence

The admin side provides operational visibility into:

-   Total tickets
-   Open tickets
-   In-progress tickets
-   Resolved tickets
-   Priority distribution
-   Category distribution
-   Agent workload
-   Recurring issues
-   Emerging issues

Agent workload includes:

-   Total assigned tickets
-   Active tickets
-   Resolved tickets
-   Agent department

------------------------------------------------------------------------

# 🧠 AI + Support Intelligence Flow

``` text
                  CUSTOMER
                      │
                      ▼
               Create Ticket
                      │
                      ▼
             ┌─────────────────┐
             │   Gemini AI     │
             │ Ticket Analysis │
             └────────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Classification   Issue Key    Recommendation
        │             │             │
        ▼             ▼             ▼
    Priority       Recurring      AI Solution
    Category        Issue          Action
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              Intelligent Routing
                      │
                      ▼
                  SUPPORT AGENT
                      │
                      ▼
              Resolve / Respond
                      │
                      ▼
              Operational Insights
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Recurring Issues       Emerging Issues
```

------------------------------------------------------------------------

# 🏗️ Architecture

Nesti follows a separated frontend/backend architecture.

``` text
Nesti
│
├── Frontend
│   └── React + Vite
│
└── Backend
    ├── Node.js
    ├── Express.js
    ├── MongoDB
    ├── Mongoose
    ├── Google Gemini
    └── Socket.IO
```

------------------------------------------------------------------------

# 🛠️ Tech Stack

## Frontend

-   React
-   Vite
-   JavaScript / JSX
-   CSS
-   Socket.IO client

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   Socket.IO

## AI

-   Google Gemini API
-   `@google/genai`

## Authentication & Authorization

-   JWT-based authentication
-   Role-based authorization
-   Customer / Agent / Admin access control

------------------------------------------------------------------------

# 📁 Project Structure

``` text
Nesti/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── issue.controller.js
│   │   │   └── ticket.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── admin.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   └── authorize.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── issue.model.js
│   │   │   ├── ticket.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── agent.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── issue.routes.js
│   │   │   └── ticket.routes.js
│   │   │
│   │   └── services/
│   │       ├── ai.service.js
│   │       ├── assignment.service.js
│   │       ├── issue.service.js
│   │       └── socket.service.js
│   │
│   └── package.json
│
└── Frontend/
    └── Nesti/
        ├── src/
        │   ├── components/
        │   ├── services/
        │   ├── AdminDashboard.jsx
        │   ├── AgentDashboard.jsx
        │   ├── CustomerDashboard.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── RoleSelection.jsx
        │   ├── App.jsx
        │   └── index.css
        │
        └── package.json
```

------------------------------------------------------------------------

# 🔄 Ticket Lifecycle

A ticket follows this general flow:

``` text
Customer creates ticket
        ↓
Validate title + description
        ↓
Gemini analyzes ticket
        ↓
Find / create recurring issue
        ↓
Determine support department
        ↓
Find suitable agent
        ↓
Create ticket
        ↓
Store AI analysis
        ↓
Assign agent
        ↓
Notify users through Socket.IO
        ↓
Agent investigates
        ↓
AI recommendation assists resolution
        ↓
Customer ↔ Agent communication
        ↓
Ticket resolved
```

------------------------------------------------------------------------

# 🗃️ Ticket Data Model

A ticket contains information such as:

``` text
title
description
priority
status
category
createdBy
assignedTo
detectedIssue
aiAnalysis
comments
createdAt
updatedAt
```

### Status values

``` text
open
in-progress
resolved
closed
```

### Priority values

``` text
low
medium
high
urgent
```

### Categories

``` text
technical
billing
account
general
```

------------------------------------------------------------------------

# 🔐 Security & Access Control

Nesti uses authentication and authorization middleware to protect API
routes.

Access is separated by role.

Examples:

``` text
Customer
  └── Own tickets

Agent
  └── Assigned tickets

Admin
  └── All tickets + analytics + intelligence
```

Ticket access is also checked so unauthorized users cannot access
another customer's ticket.

------------------------------------------------------------------------

# 🌌 Product Experience

The landing experience is designed around a premium, intelligence-first
SaaS aesthetic.

### Visual direction

-   Midnight Navy
-   Obsidian
-   Lavender
-   Teal
-   Champagne accents
-   Galaxy-inspired background
-   Soft ambient glows
-   Subtle motion
-   Premium typography
-   Minimal, non-gamified interface

The visual language reinforces the idea of Nesti as an intelligence
layer sitting above customer conversations.

------------------------------------------------------------------------

# ⚙️ Installation

## 1. Clone the repository

``` bash
git clone <your-repository-url>
cd Nesti
```

------------------------------------------------------------------------

## 2. Install backend dependencies

``` bash
cd Backend
npm install
```

------------------------------------------------------------------------

## 3. Configure backend environment variables

Create:

``` text
Backend/.env
```

Add the environment variables required by your local configuration,
including:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

If your backend uses additional environment variables, add them
according to your server configuration.

------------------------------------------------------------------------

## 4. Start the backend

``` bash
npm start
```

The backend is configured to run on the project's configured backend
port, currently used locally at:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

## 5. Install frontend dependencies

Open another terminal:

``` bash
cd Frontend/Nesti
npm install
```

------------------------------------------------------------------------

## 6. Start the frontend

``` bash
npm run dev
```

The Vite development server will provide the local frontend URL,
typically:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🔑 Example AI Output

For a ticket such as:

``` text
Title:
Cannot login

Description:
I have tried multiple times but my account won't let me sign in.
```

Nesti can produce an analysis similar to:

``` json
{
  "category": "account",
  "priority": "high",
  "intent": "Customer wants to regain access to their account",
  "summary": "Customer is unable to sign in to their account.",
  "suggestedDepartment": "IT Support",
  "issueKey": "account_login_failure",
  "issueTitle": "Account Login Failure",
  "recommendedSolution": "Verify the customer's account status and authentication logs, confirm whether credentials are being accepted, and check for recent authentication service errors.",
  "recommendedAction": "Verify account status and authentication logs",
  "solutionConfidence": "high"
}
```

------------------------------------------------------------------------

# 🔌 Important API Areas

The backend exposes functionality around:

### Authentication

``` text
Register
Login
Role-based access
```

### Tickets

``` text
Create ticket
Get customer tickets
Get ticket by ID
Get all tickets
Assign ticket
Update ticket status
Add comments
Ticket analytics
```

### Issues

``` text
Get recurring issues
Get issue by ID
Get tickets belonging to an issue
Get top recurring issues
Get emerging issues
```

------------------------------------------------------------------------

# 📈 Current Intelligence Capabilities

Nesti currently combines several layers of automation:

  Layer                 What Nesti does
  --------------------- --------------------------------------------
  Ticket Intelligence   Understands each ticket
  Classification        Categorizes and prioritizes tickets
  Issue Clustering      Groups tickets around recurring problems
  Recommendation        Suggests investigation/resolution steps
  Assignment            Routes tickets to suitable agents
  Real-Time             Pushes updates through Socket.IO
  Analytics             Measures support operations
  Emerging Issues       Detects sudden increases in problem volume

------------------------------------------------------------------------

# 🔮 Future Roadmap

Potential next-generation capabilities include:

-   Redis-backed caching and performance optimization
-   AI-generated customer response drafts
-   Knowledge-base / historical resolution retrieval
-   Semantic similarity search for previous solutions
-   SLA monitoring and breach prediction
-   Customer satisfaction analytics
-   Resolution-time prediction
-   Advanced AI agent copilot
-   Escalation prediction
-   Issue impact scoring
-   Email / external support-channel ingestion
-   Production monitoring and observability
-   Automated incident summaries

> Redis is a planned infrastructure enhancement rather than a
> requirement for the current core implementation.

------------------------------------------------------------------------

# 💡 What Makes Nesti Different?

Nesti is not designed to be just another CRUD ticketing system.

The core idea is:

``` text
Ticket
  ↓
Understanding
  ↓
Context
  ↓
Pattern
  ↓
Recommendation
  ↓
Action
```

The platform attempts to answer the questions a support team actually
cares about:

> **What are customers struggling with?**

> **Is the same problem happening repeatedly?**

> **Is something suddenly getting worse?**

> **What should the agent investigate next?**

> **Which team should handle it?**

That is the intelligence layer Nesti is built around.

------------------------------------------------------------------------

# 👩‍💻 Development Philosophy

Nesti is built around three principles:

### 01 --- Understand before routing

A ticket should not simply be assigned based on a static category.

Its actual problem should be understood first.

### 02 --- Find the pattern

Individual tickets matter, but repeated tickets can reveal a much bigger
problem.

### 03 --- Turn insight into action

AI should not only describe what is happening.

It should help the support team decide **what to do next**.

------------------------------------------------------------------------

# ⭐ Project Summary

**Nesti** is a full-stack AI-powered customer support intelligence
platform that combines:

**React + Node.js + Express + MongoDB + Gemini AI + Socket.IO**

to transform raw customer complaints into:

**organized tickets → recurring issues → emerging signals → recommended
actions.**

> **Nesti --- Where every complaint gets its nest.**

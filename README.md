# 🎓 Academic Ballot

A real-time academic polling and voting system designed for educational institutions. Teachers can create polls, manage participants, and view live results, while students can join sessions and vote on questions in real-time.

![License](https://img.shields.io/badge/license-MIT-green)


## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🔌 Socket Events](#-socket-events)
- [📱 Application Screens](#-application-screens)
- [🏗️ Architecture](#️-architecture)
- [📄 License](#-license)

## ✨ Features

### For Teachers
- **Create Polls** - Create multiple-choice questions with customizable duration (30s, 45s, 60s, 90s)
- **Mark Correct Answers** - Set the correct answer when creating a poll
- **Live Results** - View real-time vote counts and percentage distributions
- **Reveal Answers** - Optionally reveal the correct answer to all participants
- **Participant Management** - View list of all connected students
- **Kick Participants** - Remove disruptive students from the session
- **Poll History** - Access complete history of all past polls
- **In-App Chat** - Communicate with students during sessions

### For Students
- **Join Sessions** - Simple name-based registration to join a poll session
- **Real-Time Voting** - Submit votes instantly with real-time feedback
- **Live Timer** - See countdown timer for each poll
- **Answer Reveal** - View correct answers when revealed by teacher
- **In-App Chat** - Communicate with the class during sessions

### System Features
- **Real-Time Updates** - WebSocket-powered instant updates
- **Responsive Design** - Works on desktop and mobile devices
- **Auto Reconnection** - Handles network interruptions gracefully
- **Kick Prevention** - Prevents previously kicked students from rejoining 🛠️ Tech

## Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [React Router](https://reactrouter.com/) | Routing |
| [Socket.io Client](https://socket.io/) | Real-time Communication |
| [Axios](https://axios-http.com/) | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express](https://expressjs.com/) | Web Framework |
| [Socket.io](https://socket.io/) | WebSocket Server |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Mongoose](https://mongoosejs.com/) | ODM |

### Deployment
| Platform | Service |
|----------|---------|
| [Vercel](https://vercel.com/) | Frontend & Backend Hosting |


## 📁 Project Structure

```
academic-ballot/
├── LICENSE                    # MIT License
├── README.md                  # Project Documentation
├── version.json               # Version Information
├── client/                    # Frontend Application
│   ├── public/                # Static Assets
│   ├── src/
│   │   ├── api/              # API Configuration
│   │   │   └── index.js      # Axios Instance & API URL
│   │   ├── components/       # Reusable UI Components
│   │   │   ├── ChatPopup.jsx         # Chat Interface
│   │   │   ├── Layout.jsx            # Main Layout
│   │   │   ├── ParticipantsModal.jsx # Participants Management
│   │   │   ├── ParticipantsPopup.jsx # Participants Quick View
│   │   │   └── PollCard.jsx          # Poll Display Component
│   │   ├── hooks/            # Custom React Hooks
│   │   │   ├── usePollTimer.js        # Countdown Timer
│   │   │   └── useSocket.js           # Socket Connection
│   │   ├── pages/            # Page Components
│   │   │   ├── Home.jsx             # Landing Page
│   │   │   ├── PollHistory.jsx       # Past Polls History
│   │   │   ├── RoleSelection.jsx     # Teacher/Student Selection
│   │   │   ├── Student.jsx           # Student Entry Page
│   │   │   ├── StudentDashboard.jsx  # Student Main Interface
│   │   │   ├── StudentOnboarding.jsx # Student Registration
│   │   │   ├── Teacher.jsx           # Teacher Entry Page
│   │   │   └── TeacherDashboard.jsx  # Teacher Main Interface
│   │   ├── App.jsx           # Root Component
│   │   ├── index.css         # Global Styles
│   │   └── main.jsx          # Entry Point
│   ├── package.json          # Frontend Dependencies
│   ├── tailwind.config.js    # Tailwind Configuration
│   ├── vite.config.js        # Vite Configuration
│   └── vercel.json           # Vercel Deployment Config
│
└── server/                   # Backend Application
    ├── config/
    │   └── db.js             # MongoDB Connection
    ├── controllers/
    │   └── poll.controller.js    # Request Handlers
    ├── models/
    │   ├── participant.model.js  # Participant Schema
    │   ├── poll.model.js         # Poll Schema
    │   └── vote.moel.js          # Vote Schema
    ├── routes/
    │   └── poll.routes.js       # API Routes
    ├── services/
    │   └── poll.service.js      # Business Logic
    ├── sockets/
    │   └── poll.socket.js       # Socket Event Handlers
    ├── package.json             # Backend Dependencies
    ├── server.js                # Server Entry Point
    └── vercel.json              # Vercel Deployment Config
```


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or Atlas)

### Installation

1. **Clone the Repository**
   ```bash
    git clone https://github.com/UjjwalSaini07/Academic-Ballot.git
   ```
   ```bash
   cd Academic-Ballot
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   # or
   pnpm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   # or
   pnpm install
   ```

### Running the Application

#### Development Mode

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:3000
   ```

#### Production Mode

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start Production Server**
   ```bash
   cd server
   npm start
   ```


## 🔧 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/academic-ballot

# Option 2: MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/academic-ballot

# Frontend API URL (for CORS)
CLIENT_URL=http://localhost:3000
```


## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Poll Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/poll/active` | Get currently active poll |
| `GET` | `/poll/history` | Get all completed polls |
| `GET` | `/poll/participants` | Get all active participants |
| `GET` | `/poll/check-kicked` | Check if student is kicked |
| `POST` | `/poll` | Create a new poll |
| `POST` | `/poll/vote` | Submit a vote |
| `POST` | `/poll/kick` | Kick a participant |
| `POST` | `/poll/register` | Register a student |
| `PUT` | `/poll/:id/complete` | Complete a poll |
| `PUT` | `/poll/:id/reveal` | Reveal the answer |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |
| `GET` | `/api` | API information & endpoints |


## 🔌 Socket Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ name: string }` | Join as participant |
| `create_poll` | `{ question, options[], duration, correctOption }` | Create new poll |
| `vote` | `{ pollId, studentName, optionIndex }` | Submit vote |
| `kick` | `{ socketId }` | Kick participant |
| `chat_message` | `{ message }` | Send chat message |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `poll_created` | `{ poll object }` | New poll created |
| `poll_ended` | `{ poll object }` | Poll completed |
| `vote_update` | `{ poll object }` | Vote count updated |
| `answer_revealed` | `{ poll object }` | Answer revealed |
| `participants` | `[{ id, name }]` | Participants list updated |
| `kicked` | - | Current user was kicked |
| `chat_message` | `{ message }` | New chat message |
| `error_message` | `{ error }` | Error occurred |


## 📱 Application Screens

### User Flow

```
┌─────────────────┐
│   Home Page    │  →  Role Selection
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│Teacher│ │ Student│
└───┬───┘ └───┬────┘
    │         │
    ▼         ▼
┌───────────┐ ┌────────────────────┐
│ Teacher   │ │ Student            │
│ Dashboard │ │ Onboarding         │
└───────────┘ └─────────┬──────────┘
                         │
                         ▼
                  ┌────────────┐
                  │  Student   │
                  │  Dashboard │
                  └────────────┘
```

### Page Descriptions

| Page | Route | Description |
|------|-------|-------------|
| Role Selection | `/` | Choose Teacher or Student role |
| Teacher Dashboard | `/teacher` | Create & manage polls, view results |
| Student Onboarding | `/student` | Enter name to join |
| Student Dashboard | `/student/dashboard` | View polls, submit votes |
| Poll History | `/history` | View past poll results |


## 🏗️ Architecture

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client   │────▶│   Server    │────▶│  MongoDB    │
│  (React)   │◀────│  (Express)  │◀────│  (Database) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Socket.io  │◀───▶│  Socket.io  │
│  (Client)   │     │  (Server)   │
└─────────────┘     └─────────────┘
```

### Database Schemas

#### Poll Schema
```javascript
{
  question: String,           // Poll question
  options: [String],           // Answer options
  duration: Number,            // Duration in seconds
  startTime: Number,           // Poll start timestamp
  status: String,              // 'active' or 'completed'
  correctOption: Number,      // Index of correct answer (-1 if not set)
  showAnswer: Boolean,        // Whether answer is revealed
  results: [{                 // Vote counts per option
    optionIndex: Number,
    votes: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Participant Schema
```javascript
{
  name: String,                // Student name
  socketId: String,            // Socket connection ID
  isActive: Boolean,           // Currently connected
  isKicked: Boolean,           // Has been kicked
  createdAt: Date,
  updatedAt: Date
}
```

#### Vote Schema
```javascript
{
  pollId: ObjectId,            // Reference to Poll
  studentName: String,         // Student's name
  optionIndex: Number,        // Selected option
  createdAt: Date
}
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 👤 Author

**Ujjwal Saini**
- Email: ujjwalsaini0007+ballot@gmail.com
- Portfolio: https://www.ujjwalsaini.dev/
- GitHub: https://github.com/UjjwalSaini07


## 🙏 Acknowledgments

- [Intervue](https://intervue.io/) for inspiration
- [Vercel](https://vercel.com/) for hosting
- All contributors and users of Academic Ballot


<div align="center">

Made with ❤️ by [Ujjwal Saini](https://github.com/UjjwalSaini07)

</div>

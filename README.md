# 🎮 Endless Tic Tac Toe

A modern, full-stack Tic Tac Toe game with a twist - marks disappear after 3 moves! Challenge your friends locally or battle against an AI opponent.

🌐 **Live Demo:** [https://endless-tic-tac-toe-puce.vercel.app](https://endless-tic-tac-toe-puce.vercel.app)

## ✨ Features

### Game Modes
- **👥 Play with Friend** - Local 2-player mode with customizable names
- **🤖 Challenge AI** - Battle against an intelligent AI opponent
- **🏆 Leaderboard** - Compete for the fastest win time!

### Unique Mechanics
- **Endless Play** - Each player can only have 3 marks on the board
- **Disappearing Marks** - When you place your 4th mark, your oldest mark vanishes
- **Visual Warning** - Marks about to disappear are highlighted with a pulsing indicator

### UI/UX
- 🌌 Beautiful space-themed "Anti-Gravity" design
- 🎆 Confetti celebrations on wins
- 🔊 Sound effects with mute toggle
- 📱 Fully responsive for mobile devices
- ⏱️ Millisecond-precision game timer
- 💬 AI personality with dynamic comments

### Leaderboard
- 🏅 Top players displayed with gold/silver/bronze styling
- ⏰ Time-based ranking (fastest wins first)
- 🎁 Monthly prizes for top 2 players!

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Router** - Navigation

### Backend
- **Spring Boot** - Java framework
- **PostgreSQL** - Database (Neon)
- **Maven** - Build tool

### Deployment
- **Frontend:** Vercel
- **Backend:** Render (Docker)
- **Database:** Neon PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 21
- PostgreSQL (or use Neon cloud)

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Environment Variables

#### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:8080
```

#### Backend (`application.properties`)
```
DB_URL=jdbc:postgresql://localhost:5432/tictactoe_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

## 📁 Project Structure

```
endless-tic-tac-toe/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js           # Landing page
│   │   │   ├── Localgame.js      # 2-player local mode
│   │   │   ├── AIgame.js         # AI opponent mode
│   │   │   ├── LeaderboardPage.js # Full leaderboard
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── SoundContext.js   # Sound management
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── src/main/java/com/aiquiz/playwithai/
│   │   ├── controller/
│   │   │   ├── GameController.java      # AI move endpoint
│   │   │   └── LeaderboardController.java # Leaderboard API
│   │   ├── service/
│   │   │   └── AiService.java           # AI logic
│   │   ├── model/
│   │   └── repository/
│   ├── Dockerfile
│   └── pom.xml
└── README.md
```

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/game/aiMove` | POST | Get AI's next move |
| `/api/game/ready` | GET | Health check / warmup |
| `/api/leaderboard/add` | POST | Submit new score |
| `/api/leaderboard/top` | GET | Get top 10 players |
| `/api/leaderboard/all` | GET | Get all players |

## 🏆 Game Rules

1. Players take turns placing X and O marks
2. First to get 3 in a row/column/diagonal wins
3. **Twist:** Each player can only have 3 marks on the board
4. When placing a 4th mark, your oldest mark disappears
5. Optional turn timer (2s, 3s, 4s, or no timer)
6. Multiple rounds supported (1, 3, or 5 rounds)

## 📱 Screenshots

The game features a beautiful dark space theme with:
- Animated particle backgrounds
- Glowing neon effects
- Smooth animations and transitions
- Celebration confetti on wins

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License - feel free to use this project for learning or inspiration!

---

Made with ❤️ by [Sarvesh Jhawar](https://github.com/Sarvesh-Jhawar)

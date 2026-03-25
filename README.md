# 🌐 SocialFeed — Mini Social Post Application

> A full-stack social media feed built with React, Node.js, Express, MongoDB, and Cloudinary.
> Built for the **3W Full Stack Internship Assignment**.

---

## ✨ Features

- 🔐 **Auth** — Signup & Login with JWT (7-day sessions, persisted in localStorage)
- 📝 **Create Post** — Text, image, or both (Cloudinary upload, 5MB limit)
- 📰 **Public Feed** — All posts, newest first, with **pagination** (Load More)
- ❤️ **Like / Unlike** — Optimistic UI update, instant feedback
- 💬 **Comments** — Add comments, see who commented, live update
- 🗑️ **Delete** — Users can delete their own posts
- 📱 **Responsive** — Works on mobile and desktop
- 🎨 **Modern UI** — Purple gradient theme inspired by TaskPlanet

---

## 🗂 Project Structure

```
social-app/
├── backend/
│   ├── config/
│   │   └── cloudinary.js       # Cloudinary + Multer storage
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/
│   │   ├── User.js             # User schema (Collection: users)
│   │   └── Post.js             # Post schema (Collection: posts)
│   ├── routes/
│   │   ├── authRoutes.js       # POST /signup, POST /login
│   │   └── postRoutes.js       # CRUD + like + comment
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── axios.js            # Axios instance with JWT interceptor
        ├── components/
        │   ├── AppNavbar.js        # Sticky top navigation
        │   ├── CreatePost.js       # Post composer card
        │   └── PostCard.js         # Post display with like + comment
        ├── context/
        │   └── AuthContext.js      # Global auth state
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   └── Feed.js             # Main paginated feed page
        ├── utils/
        │   └── avatar.js           # Deterministic avatar color helper
        ├── App.js                  # Router + protected routes
        ├── App.css                 # All custom styles
        └── index.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/social-app.git
cd social-app
```

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your real credentials:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_random_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

Start the backend:
```bash
npm run dev    # with nodemon (development)
npm start      # production
```

API will run at: `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

App will open at: `http://localhost:3000`

---

## 🚀 Deployment

### MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create a database user
3. Network Access → Add IP: `0.0.0.0/0`
4. Get the connection string and use it as `MONGO_URI`

### Backend → Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`
7. Deploy — note your service URL (e.g. `https://social-app-api.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set root directory to `frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL = https://social-app-api.onrender.com/api
   ```
4. Deploy

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/posts?page=1&limit=10` | Yes | Paginated feed |
| POST | `/api/posts` | Yes | Create post (multipart/form-data) |
| PUT | `/api/posts/:id/like` | Yes | Toggle like/unlike |
| POST | `/api/posts/:id/comment` | Yes | Add comment |
| DELETE | `/api/posts/:id` | Yes | Delete own post |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Bootstrap, React Router v6 |
| Styling | Bootstrap 5 + Custom CSS (no Tailwind) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Images | Cloudinary + Multer |
| Icons | react-icons (Feather + Font Awesome) |

---

## 📦 MongoDB Collections

Only **2 collections** as required:

**`users`** — `username`, `email`, `password (hashed)`, `createdAt`

**`posts`** — `userId`, `username`, `text`, `imageUrl`, `likes[]`, `comments[]`, `createdAt`

---

*Built with ❤️ for 3W Full Stack Internship*

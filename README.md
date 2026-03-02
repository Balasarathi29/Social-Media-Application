# Social Media App

A modern, full-stack social media application built with Next.js, Express.js, and MongoDB.

## 🚀 Features

### User System

- User registration & login with JWT authentication
- Edit profile (bio, profile picture, cover image)
- View other users' profiles
- Follow/Unfollow users

### Posts System

- Create posts (text + optional image URL)
- Edit & delete posts (owner only)
- View global feed
- View posts by specific user

### Interactions

- Like/Unlike posts
- Comment on posts
- Delete comments (owner only)

### UI/UX

- Modern, minimal design
- Dark mode support
- Responsive (mobile-first)
- Loading skeletons
- Toast notifications
- Infinite scroll

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** React Icons

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Architecture:** MVC pattern
- **Authentication:** JWT + bcrypt
- **Image Upload:** Cloudinary (optional)

### Database

- **MongoDB** with Mongoose ODM

## 📁 Project Structure

```
social-media-app/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.js
    │   │   ├── page.js
    │   │   ├── globals.css
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── feed/
    │   │   ├── profile/[id]/
    │   │   ├── create-post/
    │   │   ├── edit-post/[id]/
    │   │   └── edit-profile/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── PostCard.js
    │   │   ├── CommentSection.js
    │   │   ├── SuggestedUsers.js
    │   │   ├── ThemeProvider.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── LoadingSpinner.js
    │   │   └── PostSkeleton.js
    │   ├── hooks/
    │   │   ├── usePosts.js
    │   │   └── useComments.js
    │   ├── lib/
    │   │   ├── api.js
    │   │   └── utils.js
    │   └── store/
    │       └── authStore.js
    ├── package.json
    ├── tailwind.config.js
    └── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/social-media-app
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

### User Routes

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/users/:id`          | Get user profile    |
| PUT    | `/api/users/:id`          | Update profile      |
| PUT    | `/api/users/follow/:id`   | Follow user         |
| PUT    | `/api/users/unfollow/:id` | Unfollow user       |
| GET    | `/api/users/suggested`    | Get suggested users |
| GET    | `/api/users/search`       | Search users        |

### Post Routes

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/posts`              | Get all posts             |
| GET    | `/api/posts/feed`         | Get feed (followed users) |
| GET    | `/api/posts/:id`          | Get single post           |
| GET    | `/api/posts/user/:userId` | Get user's posts          |
| POST   | `/api/posts`              | Create post               |
| PUT    | `/api/posts/:id`          | Update post               |
| DELETE | `/api/posts/:id`          | Delete post               |
| PUT    | `/api/posts/like/:id`     | Like/Unlike post          |

### Comment Routes

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/api/comments/:postId` | Get post comments |
| POST   | `/api/comments/:postId` | Add comment       |
| PUT    | `/api/comments/:id`     | Update comment    |
| DELETE | `/api/comments/:id`     | Delete comment    |

## 🚀 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Render)

1. Push to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster
2. Get connection string
3. Add to backend `.env`

## 📝 License

MIT License - feel free to use this project for learning or personal projects.

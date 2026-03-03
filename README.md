# 📱 Social Media App

A modern, full-stack social media application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js). This project features a robust backend API and a responsive frontend user interface.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **User Profiles**: Create and edit profiles with bios, avatars, and cover photos.
- **Posts**: Create, read, update, and delete posts with text and image support.
- **Social Interactions**:
  - Like and unlike posts.
  - Comment on posts.
  - Follow and unfollow other users.
- **Feed**: Global feed showing posts from all users (or followed users).
- **Image Uploads**: Integrated with Cloudinary for efficient image storage and delivery.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Theme Support**: Dark/Light mode toggle.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: React Icons
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Authentication**: JWT & Bcrypt
- **File Storage**: Cloudinary
- **Validation**: Express Validator

## 📂 Project Structure

```bash
social-media-app/
├── backend/                # Express.js API
│   ├── config/             # Database & Cloudinary config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & Error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
│
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & API setup
│   │   └── store/          # Zustand state stores
│   └── public/             # Static assets
└── README.md
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)
- A [Cloudinary](https://cloudinary.com/) account for image uploads.

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
# Server running on port 5000
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
# App running at http://localhost:3000
```

## 📡 API Endpoints

The backend provides the following main API routes (prefixed with `/api`):

| Method       | Endpoint              | Description             |
| :----------- | :-------------------- | :---------------------- |
| **Auth**     |                       |                         |
| POST         | `/auth/register`      | Register a new user     |
| POST         | `/auth/login`         | Login user & get token  |
| GET          | `/auth/me`            | Get current user info   |
| **Posts**    |                       |                         |
| GET          | `/posts`              | Get all posts (Feed)    |
| POST         | `/posts`              | Create a new post       |
| GET          | `/posts/:id`          | Get single post details |
| PUT          | `/posts/:id`          | Update a post           |
| DELETE       | `/posts/:id`          | Delete a post           |
| PUT          | `/posts/:id/like`     | Like/Unlike a post      |
| **Comments** |                       |                         |
| POST         | `/posts/:id/comments` | Add a comment to a post |
| DELETE       | `/comments/:id`       | Delete a comment        |
| **Users**    |                       |                         |
| GET          | `/users/:id`          | Get user profile        |
| PUT          | `/users/profile`      | Update profile          |
| PUT          | `/users/follow/:id`   | Follow/Unfollow user    |

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

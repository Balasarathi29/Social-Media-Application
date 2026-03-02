const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

dotenv.config();

const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    bio: "Tech enthusiast & coffee lover. Always coding ☕️💻",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=Jane+Smith&background=EB4D4B&color=fff",
    bio: "Traveling the world, one photo at a time 🌍📸",
  },
  {
    username: "mike_wilson",
    email: "mike@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=Mike+Wilson&background=F0932B&color=fff",
    bio: "Full stack developer | Open source contributor",
  },
  {
    username: "sarah_williams",
    email: "sarah@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=Sarah+Williams&background=6AB04C&color=fff",
    bio: "Design thinking | User experience advocate 🎨",
  },
  {
    username: "david_brown",
    email: "david@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=David+Brown&background=9C88FF&color=fff",
    bio: "Gamer 🎮 | Streamer 🔴",
  },
  {
    username: "emily_clark",
    email: "emily@example.com",
    password: "password123",
    profileImage:
      "https://ui-avatars.com/api/?name=Emily+Clark&background=BE2EDD&color=fff",
    bio: "Bookworm 📚 | Writing my first novel",
  },
];

const posts = [
  {
    content:
      "Just finished building my new PC! It's a beast for gaming and coding. #PCBuild #Gaming",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content: "Beautiful sunset at the beach today. Nature is amazing! 🌅",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content:
      "Working on a new React project using Next.js. The developer experience is fantastic! ⚛️",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content:
      "Exploring the mountains this weekend. The view from the top is breathtaking. 🏔️",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content:
      "My new workspace setup. Clean and minimal for maximum productivity. ✨",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content: "Trying out this new coffee shop. Their latte art is on point! ☕",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content: "Check out this amazing short clip I captured!",
    image:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    mediaType: "video",
  },
  {
    content:
      "Coding late night... solving bugs is satisfying when creates that 'aha' moment! 🐛🚫",
    image: "", // Text only post
    mediaType: "image",
  },
  {
    content: "Just adopted this cute puppy! Meet Max 🐶",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
  {
    content: "Incredible architecture in the city center.",
    image:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=1000",
    mediaType: "image",
  },
];

const comments = [
  "Awesome! 🔥",
  "Looks great! 👍",
  "Amazing shot! 📸",
  "Keep up the good work! 💪",
  "Connecting with this!",
  "Where is this place? 📍",
  "Totally agree with you.",
  "Love it! ❤️",
  "This is inspiring.",
  "Can't wait to see more!",
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log("Data Cleared!");

    // Create Users
    const createdUsers = await User.create(users);
    const userIds = createdUsers.map((user) => user._id);

    // Create Follows (Random)
    for (const user of createdUsers) {
      const otherUsers = userIds.filter((id) => !id.equals(user._id));
      // Follow 2-3 random users
      const randomFollows = otherUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 2);

      user.following.push(...randomFollows);
      await user.save();

      // Update followers for the followed users
      for (const followedId of randomFollows) {
        await User.findByIdAndUpdate(followedId, {
          $push: { followers: user._id },
        });
      }
    }

    // Create Posts
    const postsWithAuthors = posts.map((post) => {
      const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
      // Add some random likes
      const randomLikes = userIds
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * userIds.length));

      return { ...post, author: randomUser, likes: randomLikes };
    });

    const createdPosts = await Post.create(postsWithAuthors);

    // Create Comments
    for (const post of createdPosts) {
      // Add 0-4 random comments per post
      const numComments = Math.floor(Math.random() * 5);
      for (let i = 0; i < numComments; i++) {
        const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
        const randomComment =
          comments[Math.floor(Math.random() * comments.length)];

        const comment = await Comment.create({
          content: randomComment,
          post: post._id,
          author: randomUser,
        });

        await Post.findByIdAndUpdate(post._id, {
          $push: { comments: comment._id },
        });
      }
    }

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

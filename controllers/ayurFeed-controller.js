import AyurFeedPost from "../models/ayurFeedPost.js";
import { ayurFeedSchema } from "../schemas/ayurFeed-schema.js";

// ✅ Create Post
export const createPost = async (req, res) => {
  try {
    const validation = ayurFeedSchema.safeParse(req.body);
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error.flatten());
      return res.status(400).json({
        message: "Validation Error",
        errors: validation.error.flatten(),
      });
    }

    const newPost = new AyurFeedPost(validation.data);
    await newPost.save();

    console.log("✅ AyurFeedPost created:", newPost._id);
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error("🚨 Error creating AyurFeedPost:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};

// ✅ Get posts for a specific user
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.params.id; // ✅ matches route parameter :id
    const posts = await AyurFeedPost.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("🚨 Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};

// 🗑️ Delete Post (only by creator)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // frontend will send current userId

    const post = await AyurFeedPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await AyurFeedPost.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("🚨 Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
};
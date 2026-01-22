import express from "express";
import { createPost, getAllPosts, deletePost } from "../controllers/ayurFeed-controller.js";

const router = express.Router();

router.post("/add", createPost);
router.get("/user/:id", getAllPosts);
router.delete("/delete/:id", deletePost);

export default router;
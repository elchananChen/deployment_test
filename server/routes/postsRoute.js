import express from "express";
import {
  crateNewPost,
  getAllPosts,
  getFilteredPosts,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/cratePost", verifyToken, crateNewPost);

router.get("/", getAllPosts);

router.get("/getFilteredPosts", getFilteredPosts);

// router.get("/byId/:id", getPostById);

// router.delete("/byId/:id", verifyToken, deletePostById);

// router.put("/like/:id", verifyToken,likePost)

export default router;

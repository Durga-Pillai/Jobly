import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createPost,
  deletePost,
  getComments,
  getPostById,
  getPostsByUser,
  getPostsInFeed,
  searchPost
} from "../controllers/postController.js";
import upload from "../middlewares/multer.js";
import { uploadPostImages } from "../controllers/uploadController.js";

const router = express.Router();

const maxUploadCount = 5;

router.post("/", protect, createPost);
router.delete("/", protect, deletePost);
router.get("/user/:id", protect, getPostsByUser);
router.get("/feed/:id", protect, getPostsInFeed);
router.get("/:id", protect, getPostById);
router.get("/comments/:id", protect, getComments);
router.get("/search",protect,searchPost);
// make sure the key value being based is images not image
router.post(
  "/upload",
  upload.array("images", maxUploadCount),
  uploadPostImages
);

export default router;

import express from "express";
import multer from "multer";
import Video from "../models/Video.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// UPLOAD ROUTE
router.post("/upload-full-video", upload.single("video"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const filePath = req.file.path;

    const newVideo = await Video.create({
      userId,
      filePath
    });

    res.json({ success: true, video: newVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET all videos for a user
router.get("/user-videos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await Video.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch videos" });
  }
});

// ✅ FORCE DOWNLOAD (NEW ROUTE)
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;

  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

export default router;

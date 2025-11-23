import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);

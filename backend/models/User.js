import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true }, 
  hpassword: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
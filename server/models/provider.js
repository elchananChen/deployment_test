import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  providerType: {
    type: String,
    enum: ["private", "ngo"],
    required: true,
    trim: true,
    lowercase: true,
  },

  bannerImg: {
    type: String,
  },

  bio: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  webLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Provider", providerSchema);

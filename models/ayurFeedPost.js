import mongoose from "mongoose";

const AyurFeedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Post must have at least 5 characters"],
    },
    hashtags: {
      type: [String],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.every(tag => typeof tag === "string");
        },
        message: "Hashtags must be valid strings",
      },
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AyurFeedPost", AyurFeedPostSchema);
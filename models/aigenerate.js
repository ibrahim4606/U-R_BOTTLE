const mongoose = require("mongoose");

const aiDesignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    BrandType: {
      type: String,
      trim: true,
      lowercase: true,
    },

    colorTheme: {
      type: String,
      trim: true,
    },

    outputSlogan: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const AiDesign = mongoose.model("AiDesign", aiDesignSchema);
module.exports = AiDesign;

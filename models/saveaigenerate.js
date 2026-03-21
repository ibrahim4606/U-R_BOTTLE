const mongoose = require("mongoose");

const SaveAiDesignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Slogans: {
      type: [String],
    },

    // logo: {
    //   type: [String],
    // },
  },
  { timestamps: true },
);

const SaveAiDesign = mongoose.model("SaveAiDesign", SaveAiDesignSchema);
module.exports = SaveAiDesign;

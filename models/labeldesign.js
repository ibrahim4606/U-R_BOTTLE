const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema(
  {
    bottleVolume: {
      type: String,
      required: true,
      enum: ["100ml", "250ml", "500ml", "1L"],
    },

    title: {
      //brandname
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },

    BrandType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    colorTheme: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },

    slogan: {
      type: String,
      minlength: 3,
      maxlength: 120,
      trim: true,
      default: null,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
      trim: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 1,
    },

    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    // status: {
    //   type: String,
    //   enum: ["active", "draft", "archived"],
    //   default: "active",
    // },

    //     labelName: {
    //       type: String,
    //       required: true,
    //       minlength: 3,
    //       maxlength: 60,
    //       trim: true,
    //     },

    // labelShape: {
    //   type: String,
    //   required: true,
    //   enum: ["horizontal-wrap", "front-back", "full-body"],
    // },

    // labelFinish: {
    //   type: String,
    //   required: true,
    //   enum: ["matte", "glossy", "transparent"],
    //   lowercase: true,
    // },

    // printingType: {
    //   type: String,
    //   required: true,
    //   enum: ["digital", "offset", "screen"],
    //   lowercase: true,
    // },
  },
  { timestamps: true },
);
const LabelDesign = mongoose.model("LabelDesign", labelSchema);
module.exports = LabelDesign;

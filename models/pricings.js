const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    bottleVolume: {
      type: String,
      trim: true,
    },

    basePrice: {
      type: Number,
    },

    printingCost: {
      type: Number,
    },

    minOrderQty: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    bottlePerUnit: {
      type: Number,
    },

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

    // labelShape: {
    //   type: String,
    //   required: true,
    //   enum: ["horizontal-wrap", "front-back", "full-body"],
    // },

    // finishCost: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   default: 0,
    // },

    // shapeCost: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   default: 0,
    // },

    // bulkDiscount: [
    //   {
    //     minQty: {
    //       type: Number,
    //       required: true,
    //     },
    //     discountPercentage: {
    //       type: Number,
    //       required: true,
    //       min: 0,
    //       max: 80,
    //     },
    //   },
    // ],
  },
  { timestamps: true },
);

const Pricing = mongoose.model("Pricing", pricingSchema);
module.exports = Pricing;

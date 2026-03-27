const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        template: {
          type: String,
        },

        bottleVolume: {
          type: String,
        },

        title: {
          //brandname
          type: String,
          trim: true,
        },

        BrandType: {
          type: String,
          required: true,
          lowercase: true,
        },

        colorTheme: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          required: true,
          trim: true,
        },

        logo: {
          type: String,
          required: true,
        },

        slogan: {
          type: String,
          trim: true,
          default: "",
        },

        units: {
          type: Number,
          required: true,
        },

        perUnitPrice: {
          type: Number,
          required: true,
        },

        TotalPrice: {
          type: Number,
          required: true,
        },

        // pricingId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Pricing",
        //   required: true,
        // },

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

        // labelDesignId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Label",
        //   required: true,
        // },
      },
    ],

    // cartStatus: {
    //   type: String,
    //   enum: ["active", "converted", "abandoned"],
    //   default: "active",
    // },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;

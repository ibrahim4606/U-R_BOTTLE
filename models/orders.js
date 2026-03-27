const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  // orderNumber: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },

  // customerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },

  // labelDesignId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Label",
  //   required: true,
  // },

  // pricingId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Pricing",
  //   required: true,
  // },
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        title: String,
        logo: String,
        BrandType: String,
        bottleVolume: String,
        units: Number,
        perUnitPrice: Number,
        TotalPrice: Number,
      },
    ],

    totalAmount: Number,

    shippingDetails: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        match: /^[0-9]{10}$/,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },

      orderStatus: {
        type: String,
        enum: ["Order Placed", "In Progress", "Delivered", "Rejected"],
        default: "Order Placed",
      },

      rejectReason: {
        type: String,
        default: "",
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    number: {
      type: String,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
    },

    complaint: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;

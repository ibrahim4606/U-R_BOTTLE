const mongoose = require("mongoose");
const User = require("./users");
const Cart = require("./cart");
const Order = require("./orders");
const Contact = require("./contact");
const AiDesign = require("./aigenerate");
const SaveAiDesign = require("./saveaigenerate");

const MONGO_URL = "mongodb://127.0.0.1:27017/ur_bottle";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await User.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Contact.deleteMany({});
  await AiDesign.deleteMany({});
  await SaveAiDesign.deleteMany({});

  console.log("Old database cleared");
  console.log("New database initialized");

  mongoose.connection.close();
};

initDB();
